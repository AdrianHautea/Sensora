from collections import deque

FOCUS_WINDOW_SIZE = 120

focus_buffer = deque(maxlen=FOCUS_WINDOW_SIZE)

def add_sample(sample):
    focus_buffer.append(sample)

def get_recent_samples():
    return list(focus_buffer)

def clear_buffer():
    focus_buffer.clear()