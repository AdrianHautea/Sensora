import time
import requests
from collections import deque
import numpy as np

SERVER_URL = 'http://localhost:5000/vision'
SEND_INTERVAL = 1.0

def send_to_backend(data):
    try:
        requests.post(SERVER_URL, json=data, timeout=0.2)
    except:
        pass

class FocusScorer:
    def __init__(self, window_size=15):
        # rolling focus score window (~0.5–1 sec depending on FPS)
        self.focus_window = deque(maxlen=window_size)

        # optional rolling engagement window
        self.engagement_window = deque(maxlen=window_size)

        # timestamp tracker
        self.last_send_time = 0

    # signal scoring helpers
    def _engagement_score(self, engagement, confidence):
        if engagement == 'ENGAGED':
            return 1.0 * confidence
        
        return 0.0

    def _gaze_score(self, gaze):
        if gaze == 'CENTER':
            return 1.0
        if gaze in ['LEFT', 'RIGHT']:
            return 0.4

        return 0.2

    def _head_pose_score(self, yaw):
        yaw = abs(yaw)
        if yaw < 10:
            return 1.0
        if yaw < 25:
            return 0.6

        return 0.2

    # main focus scoring function
    def compute_focus_score(
        self,
        emotion,
        engagement,
        gaze,
        yaw,
        pitch,
        roll,
        confidence
    ):

        # compute raw signals
        engagement_score = self._engagement_score(
            engagement,
            confidence
        )

        gaze_score = self._gaze_score(gaze)
        head_score = self._head_pose_score(yaw)

        # raw focus score
        raw_focus = (
            0.5 * engagement_score +
            0.35 * gaze_score +
            0.15 * head_score
        )

        # clamp
        raw_focus = float(np.clip(raw_focus, 0, 1))

        # smoothing window
        self.focus_window.append(raw_focus)
        smoothed_focus = float(np.mean(self.focus_window))

        self.engagement_window.append(
            1 if engagement == 'ENGAGED' else 0
        )

        engagement_avg = float(np.mean(self.engagement_window))


        # return JSON ready output
        result = {
            'timestamp': time.time(),
            'emotion': emotion,
            'engagement': engagement,
            'confidence': float(confidence),
            'gaze': gaze,
            'yaw': float(yaw),
            'pitch': float(pitch),
            'roll': float(roll),

            # raw signals
            'engagement_score': float(engagement_score),
            'gaze_score': float(gaze_score),
            'head_pose_score': float(head_score),

            # focus scores
            'focus_raw': raw_focus,
            'focus_smoothed': smoothed_focus,

            # rolling engagement
            'engagement_smoothed': engagement_avg
        }

        current_time = time.time()

        if current_time - self.last_send_time > SEND_INTERVAL:
            send_to_backend(result)
            self.last_send_time = current_time
            
        return result