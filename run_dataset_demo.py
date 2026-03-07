import os
import cv2

from pipelines.mediapipe_utils import detect_face
from pipelines.engagement_pipeline import predict_engagement

DATASET_PATH = 'dataset'

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        if not file.lower().endswith(('png', 'jpg', 'jpeg')):
            continue

        path = os.path.join(root, file)
        frame = cv2.imread(path)

        if frame is None:
            continue

        face, bbox = detect_face(frame)

        if face is None:
            print('No face detected:', path)
            continue

        label, emo, conf = predict_engagement(face)
        x1, y1, x2, y2 = bbox

        # draw face box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        # draw label
        cv2.putText(
            frame,
            f'{emo} -> {label} ({conf:.2f})',
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        cv2.imshow('Engagement Detection', frame)
        key = cv2.waitKey(50)

        if key == 27:
            break
cv2.destroyAllWindows()