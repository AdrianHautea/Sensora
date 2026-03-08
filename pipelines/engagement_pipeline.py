import joblib
from pipelines.clip_utils import get_clip_embedding

EMOTIONS = [
    'confused',
    'focused',
    'frustrated',
    'bored',
    'drowsy',
    'looking_away'
]

ENGAGED_EMOTIONS = {
    'confused',
    'focused',
    'frustrated'
}

clf = joblib.load('models/emotion_classifier.pkl')

def predict_engagement(face_image):

    embedding = get_clip_embedding(face_image)
    emotion_idx = clf.predict([embedding])[0]
    emotion = EMOTIONS[emotion_idx]

    prob = clf.predict_proba([embedding])[0]
    confidence = prob[emotion_idx]

    print('Emotion probabilities:')
    for e, p in zip(EMOTIONS, prob):
        print(f"{e}: {p:.3f}")
    print()

    if emotion in ENGAGED_EMOTIONS:
        label = 'ENGAGED'
    else:
        label = 'NOT ENGAGED'

    return label, emotion, confidence