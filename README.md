# Sensora

A real-time study-focus monitor. A webcam watches you study, a computer-vision pipeline scores how engaged you are moment to moment, and an LLM turns those signals into short, actionable study nudges that are pushed to an ESP hardware device over serial. Built at a hackathon by a team of four.

## How it works

```
Webcam ──► Vision pipeline ──► Focus score ──► Flask backend ──► LLM recommendation ──► ESP device
          (face + emotion +     (weighted,      (rolling store)   (Gemini via LangChain)   (over serial)
           gaze + head pose)      smoothed)
```

1. **Capture & detect** — OpenCV pulls frames; MediaPipe detects the face and facial landmarks.
2. **Classify engagement** — the cropped face is embedded with **OpenAI CLIP**, and a trained classifier maps the embedding to one of six states (`focused`, `confused`, `frustrated`, `bored`, `drowsy`, `looking_away`), each labeled ENGAGED / NOT ENGAGED.
3. **Score focus** — engagement, gaze direction, and head-pose (yaw) are combined into a weighted focus score and smoothed over a rolling window.
4. **Store & stream** — per-second samples are POSTed to a Flask backend that keeps a rolling history.
5. **Recommend** — on an interval, recent samples (average focus, dominant emotion, on-screen ratio) are summarized into a prompt and sent to **Gemini via LangChain**, which returns a short (≤12-word) study recommendation.
6. **Act** — recommendations are pushed to an **ESP microcontroller over serial** for physical display/feedback.

## My contribution

I owned the backend intelligence layer:

- **Vision → focus pipeline** — CLIP-embedding-based emotion/engagement classification (`pipelines/`), and the weighted, smoothed focus-scoring logic (`focus_scoring.py`).
- **LLM study recommendations** — the LangChain + Gemini recommendation engine that turns aggregated focus signals into concise nudges (`backend/recommendation.py`, `recommendation_loop.py`).
- **Integration** — connecting the vision pipeline, Flask API, and the serial/ESP output path.

Teammates (3) built the frontend and the hardware/ESP side.

## Tech stack

**Vision / ML:** OpenCV, MediaPipe, OpenAI CLIP (`clip-vit-base-patch32`) via Hugging Face Transformers, PyTorch, scikit-learn (joblib-serialized classifiers)
**Backend:** Python, Flask, Flask-CORS, threading for the recommendation loop
**LLM:** LangChain + Google Gemini (`langchain-google-genai`)
**Hardware I/O:** pyserial → ESP microcontroller
**Frontend:** React + Vite

## Project structure

```
Sensora/
├── pipelines/                 # Vision: face detection, CLIP embeddings, eye tracking, focus scoring, smoothing
│   ├── clip_utils.py          #   CLIP image embeddings
│   ├── engagement_pipeline.py #   emotion/engagement classification
│   ├── eye_tracking_utils.py  #   gaze + head pose
│   └── focus_scoring.py       #   weighted, smoothed focus score
├── backend/                   # Flask API + recommendation engine
│   ├── app.py                 #   app factory, routes, starts recommendation loop
│   ├── vision_routes.py       #   POST /vision  (ingest samples)
│   ├── esp_routes.py          #   GET  /esp/recommendation
│   ├── recommendation.py      #   LangChain + Gemini prompt → recommendation
│   ├── recommendation_loop.py #   background loop → serial
│   ├── serial_sender.py       #   ESP serial output
│   └── focus_store.py         #   rolling sample store
├── models/                    # Trained classifiers + MediaPipe model files
├── dataset/                   # Labeled engagement/emotion training images
├── Sensora/                   # React + Vite frontend
├── run_camera_pipeline.py     # Entry point: live webcam pipeline
├── run_dataset_demo.py        # Entry point: run against the dataset
└── requirements.txt
```

## Running it

**Requirements:** Python 3.11, a webcam, and (for hardware output) an ESP device. A `GEMINI_API_KEY` is needed for recommendations.

```bash
pip install -r requirements.txt
export GEMINI_API_KEY=your_key_here      # Windows: set GEMINI_API_KEY=...
```

Start the backend (Flask API + recommendation loop):

```bash
python -m backend.app          # serves on http://0.0.0.0:5000
```

Run the live camera pipeline (in a second terminal):

```bash
python run_camera_pipeline.py  # opens the webcam focus monitor
```

Or run against the bundled dataset instead of a live camera:

```bash
python run_dataset_demo.py
```

### Notes

- The serial port defaults to `COM5` in `backend/serial_sender.py` — change `PORT` for your system, or set `TEST_MODE = True` to run without hardware (recommendations print to console).
- The camera index defaults to `1` in `run_camera_pipeline.py`; use `0` if you only have one webcam.

## Status

Hackathon project — a working prototype demonstrating the full loop (vision → scoring → LLM → hardware), not production-hardened.
