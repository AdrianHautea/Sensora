import os
import cv2

from pipelines.mediapipe_utils import detect_face
from pipelines.engagement_pipeline import predict_engagement
from pipelines.eye_tracking_utils import get_eye_tracking
from pipelines.smoothing_utils import MajorityVote

DATASET_PATH = 'dataset'

engagement_smoother = MajorityVote(window_size=10)

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        if not file.lower().endswith(('png', 'jpg', 'jpeg')):
            continue

        path = os.path.join(root, file)
        frame = cv2.imread(path)

        if frame is None:
            continue

        face, bbox = detect_face(frame)
        eye_data = get_eye_tracking(frame)

        if face is None:
            print('No face detected:', path)
            continue

        label, emo, conf = predict_engagement(face)
        smoothed_label = engagement_smoother.update(label)
        x1, y1, x2, y2 = bbox

        # draw face box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        gaze = eye_data['gaze']
        yaw = eye_data['head_yaw']

        cv2.putText(
            frame,
            f'{smoothed_label} | Yaw: {yaw:.1f} | Gaze: {gaze}',
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0,255,0),
            2
        )

        iris = eye_data['iris']
        if iris is not None:
            cv2.circle(frame, iris, 3, (0,0,255), -1)

        cv2.imshow('Engagement Detection', frame)
        key = cv2.waitKey(10)

        if key == 27:
            break

cv2.destroyAllWindows()