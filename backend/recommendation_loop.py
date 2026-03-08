import time
import threading

from backend.focus_store import get_recent_samples
from backend.recommendation import generate_recommendation
from backend.serial_sender import SerialSender


INTERVAL = 10  # seconds

def recommendation_worker():
    print('Recommendation Loop Started')
    sender = SerialSender()
    last_timestamp = 0   # initialize here
    while True:
        samples = get_recent_samples()
        if len(samples) == 0:
            time.sleep(INTERVAL)
            continue

        latest_sample = samples[-1]
        if latest_sample['timestamp'] <= last_timestamp:
            time.sleep(INTERVAL)
            continue

        last_timestamp = latest_sample['timestamp']
        if len(samples) > 10:
            rec = generate_recommendation(samples)
            print('Recommendation:', rec)
            sender.send(rec)

        time.sleep(INTERVAL)


def start_recommendation_loop():
    thread = threading.Thread(
        target=recommendation_worker,
        daemon=True
    )

    thread.start()