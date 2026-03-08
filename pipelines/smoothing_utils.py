from collections import deque
import numpy as np

class MovingAverage:
    def __init__(self, window_size=5):
        self.window = deque(maxlen=window_size)

    def update(self, value):
        self.window.append(value)
        return np.mean(self.window)


class MajorityVote:
    def __init__(self, window_size=10):
        self.window = deque(maxlen=window_size)

    def update(self, value):
        self.window.append(value)
        values, counts = np.unique(self.window, return_counts=True)
        return values[counts.argmax()]