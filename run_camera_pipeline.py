import cv2

from pipelines.mediapipe_utils import detect_face
from pipelines.engagement_pipeline import predict_engagement
from pipelines.eye_tracking_utils import get_eye_tracking
from pipelines.smoothing_utils import MajorityVote
from pipelines.focus_scoring import FocusScorer

engagement_smoother = MajorityVote(window_size=10)
emotion_smoother = MajorityVote(window_size=8)
focus_scorer = FocusScorer(window_size=15)


def main():
    cap = cv2.VideoCapture(1)

    if not cap.isOpened():
        raise RuntimeError('Could not open webcam')

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        face, bbox = detect_face(frame)
        eye_data = get_eye_tracking(frame)

        if face is None:
            cv2.imshow('Focus Monitor', frame)
            if cv2.waitKey(1) == 27:
                break
            continue

        label, emotion, confidence = predict_engagement(face)
        smoothed_label = engagement_smoother.update(label)
        emotion = emotion_smoother.update(emotion)

        if confidence < 0.30:
            emotion = 'focused'

        gaze = eye_data['gaze']
        yaw = eye_data['head_yaw']
        pitch = eye_data['head_pitch']
        roll = eye_data['head_roll']

        focus_data = focus_scorer.compute_focus_score(
            emotion,
            smoothed_label,
            gaze,
            yaw,
            pitch,
            roll,
            confidence
        )

        x1, y1, x2, y2 = bbox
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)

        cv2.putText(
            frame,
            f"Focus: {focus_data['focus_smoothed']:.2f}",
            (x1, y1 - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0,255,0),
            2
        )

        cv2.putText(frame, f"Gaze: {gaze}", (20,40), cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,0),2)
        cv2.putText(frame, f"Emotion: {emotion}", (20,70), cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,0),2)
        cv2.putText(frame, f"Confidence: {confidence:.2f}", (20,100), cv2.FONT_HERSHEY_SIMPLEX,0.6,(0,255,0),2)

        iris = eye_data['iris']

        if iris is not None:
            cv2.circle(frame, iris, 3, (0,0,255), -1)

        cv2.imshow('Focus Monitor', frame)

        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()