import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# load detector
base_options = python.BaseOptions(
    model_asset_path = 'models/blaze_face_short_range.tflite'
)

options = vision.FaceDetectorOptions(
    base_options=base_options
)

detector = vision.FaceDetector.create_from_options(options)

def detect_face(frame, padding=0.2):

    mp_image = mp.Image(
        image_format = mp.ImageFormat.SRGB,
        data = frame
    )

    result = detector.detect(mp_image)

    if len(result.detections) == 0:
        return None, None

    bbox = result.detections[0].bounding_box

    x = bbox.origin_x
    y = bbox.origin_y
    w = bbox.width
    h = bbox.height

    H, W, _ = frame.shape

    size = max(w, h)

    cx = x + w // 2
    cy = y + h // 2

    size = int(size * (1 + padding))

    x1 = max(0, cx - size // 2)
    y1 = max(0, cy - size // 2)
    x2 = min(W, cx + size // 2)
    y2 = min(H, cy + size // 2)

    face = frame[y1:y2, x1:x2]
    bbox_draw = (x1, y1, x2, y2)

    return face, bbox_draw