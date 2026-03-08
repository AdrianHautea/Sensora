import requests
import random
import time

URL = "http://localhost:5000/vision"

emotions = [
    "focused",
    "frustrated",
    "confused",
    "bored"
]

while True:

    payload = {
        "timestamp": time.time(),
        "emotion": random.choice(emotions),
        "engagement": "engaged",
        "confidence": 0.8,
        "gaze": "looking_center",
        "yaw": 1.2,
        "pitch": -0.5,
        "roll": 0.3,
        "engagement_score": random.random(),
        "gaze_score": random.random(),
        "head_pose_score": random.random(),
        "focus_raw": random.random(),
        "focus_smoothed": random.random(),
        "engagement_smoothed": random.random()
    }

    requests.post(URL, json=payload)

    print("Sent sample")

    time.sleep(1)