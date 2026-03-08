import os
import statistics
from langchain_google_genai import ChatGoogleGenerativeAI

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model = "gemini-2.5-flash",
    google_api_key = GEMINI_API_KEY
)

def generate_recommendation(samples):

    if len(samples) == 0:
        return 'Start studying.'

    focus_values = [s['focus_smoothed'] for s in samples]
    emotions = [s['emotion'] for s in samples]
    gaze_values = [s['gaze'] for s in samples]

    avg_focus = statistics.mean(focus_values)

    dominant_emotion = max(set(emotions), key=emotions.count)

    gaze_center_ratio = gaze_values.count('looking_center') / len(gaze_values)

    prompt = f"""
        You are an AI study assistant.

        Student stats over the last 2 minutes:

        Average focus score: {avg_focus}
        Dominant emotion: {dominant_emotion}
        Looking at screen ratio: {gaze_center_ratio}

        Give a SHORT recommendation (max 12 words).
        """

    print('Sending prompt to Gemini')
    print(prompt)

    response = llm.invoke(prompt)
    
    return response.content.strip()