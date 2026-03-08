import cv2
import numpy as np
import mediapipe as mp

from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from pipelines.smoothing_utils import MovingAverage

yaw_filter = MovingAverage(window_size=5)

# load face landmarker
base_options = python.BaseOptions(
    model_asset_path = 'models/face_landmarker.task'
)

options = vision.FaceLandmarkerOptions(
    base_options = base_options,
    output_face_blendshapes = False,
    output_facial_transformation_matrixes = True,
    num_faces = 1
)

landmarker = vision.FaceLandmarker.create_from_options(options)

# landmark indices
LEFT_EYE = [33, 133]
RIGHT_EYE = [362, 263]

LEFT_IRIS = [468, 469, 470, 471]
RIGHT_IRIS = [473, 474, 475, 476]

NOSE_TIP = 1
CHIN = 152
LEFT_EYE_CORNER = 33
RIGHT_EYE_CORNER = 263


# helper functions
def _center(points):
    return np.mean(points, axis=0)

def _ratio(iris, left, right):
    eye_width = np.linalg.norm(right - left)
    iris_dist = np.linalg.norm(iris - left)

    if eye_width == 0:
        return 0.5

    return iris_dist / eye_width


def _estimate_head_pose(points, frame_shape):
    h, w, _ = frame_shape

    # 2D image points from MediaPipe
    image_points = np.array([
        points[1],    # nose
        points[152],  # chin
        points[33],   # left eye corner
        points[263],  # right eye corner
        points[61],   # left mouth
        points[291]   # right mouth
    ], dtype = 'double')

    # 3D model points (approximate face model)
    model_points = np.array([
        (0.0, 0.0, 0.0),          # nose tip
        (0.0, -330.0, -65.0),     # chin
        (-225.0, 170.0, -135.0),  # left eye
        (225.0, 170.0, -135.0),   # right eye
        (-150.0, -150.0, -125.0), # left mouth
        (150.0, -150.0, -125.0)   # right mouth
    ])

    focal_length = w
    center = (w / 2, h / 2)

    camera_matrix = np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype = 'double')

    dist_coeffs = np.zeros((4,1))

    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points,
        image_points,
        camera_matrix,
        dist_coeffs,
        flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return 0,0,0

    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
    sy = np.sqrt(rotation_matrix[0,0]**2 + rotation_matrix[1,0]**2)

    yaw = np.degrees(np.arctan2(rotation_matrix[1,0], rotation_matrix[0,0]))
    pitch = np.degrees(np.arctan2(-rotation_matrix[2,0], sy))
    roll = np.degrees(np.arctan2(rotation_matrix[2,1], rotation_matrix[2,2]))

    return yaw, pitch, roll

# main function
def get_eye_tracking(frame):

    h, w, _ = frame.shape
    mp_image = mp.Image(
        image_format = mp.ImageFormat.SRGB,
        data = frame
    )

    result = landmarker.detect(mp_image)

    if len(result.face_landmarks) == 0:
        return {
            'gaze': 'UNKNOWN',
            'head_yaw': 0,
            'head_pitch': 0,
            'head_roll': 0,
            'iris': None
        }

    landmarks = result.face_landmarks[0]

    points = []

    for lm in landmarks:
        points.append((int(lm.x * w), int(lm.y * h)))

    points = np.array(points)

    # rye ratios
    left_eye_left = points[LEFT_EYE[0]]
    left_eye_right = points[LEFT_EYE[1]]
    left_iris = _center(points[LEFT_IRIS])

    right_eye_left = points[RIGHT_EYE[0]]
    right_eye_right = points[RIGHT_EYE[1]]
    right_iris = _center(points[RIGHT_IRIS])

    left_ratio = _ratio(left_iris, left_eye_left, left_eye_right)
    right_ratio = _ratio(right_iris, right_eye_left, right_eye_right)

    gaze_ratio = (left_ratio + right_ratio) / 2

    # head pose
    yaw, pitch, roll = _estimate_head_pose(points, frame.shape)
    yaw = yaw_filter.update(yaw)

    # combine gaze + head pose
    if gaze_ratio < 0.35 or yaw < -15:
        gaze = 'LEFT'
    elif gaze_ratio > 0.65 or yaw > 15:
        gaze = 'RIGHT'
    else:
        gaze = 'CENTER'

    iris_pos = tuple(left_iris.astype(int))

    return {
        'gaze': gaze,
        'head_yaw': yaw,
        'head_pitch': pitch,
        'head_roll': roll,
        'iris': iris_pos
    }