# video_to_frame.py
import cv2
import os
from  flask import Flask, jsonify
import easyocr
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(".env.video")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
video_path = "./media/test.mp4"
directory = "extracted_frames"
client = OpenAI(api_key=OPENAI_API_KEY)

def extract_frames(video_path, interval_sec=1):
    cap = cv2.VideoCapture(video_path)
    output_dir = "extracted_frames"
    os.makedirs(output_dir, exist_ok=True)

    if not cap.isOpened():
        raise IOError(f"Cannot open video file: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval_sec)
    frame_count = 0
    saved_count = 0

    print(f"Extracting frames every {interval_sec} seconds from: {video_path}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
            cv2.imwrite(filename, frame)
            print(f"Saved {filename}")
            saved_count += 1
        frame_count += 1
    cap.release()

def run_ocr_on_frames(directory):
    reader = easyocr.Reader(['en', 'es'])
    all_text = []
    for filename in sorted(os.listdir(directory)):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):

            filepath = os.path.join(directory, filename)

            frame = cv2.imread(filepath)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            results = reader.readtext(frame_rgb)
            text = " ".join([entry[1] for entry in results])
            all_text.append(text + " ")
            print(f"OCR for {filename}: {text}")
    return "".join(all_text)

def llm_output(text):
    response = client.chat.completions.create(
        model ="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"The user has pr {text}"},
            {"role": "system", "content": "You are a helpful assistant that summarizes text and explains it"}
        ]
    )
    text = response.choices[0].message['content']
    return text


@app.route('/', methods=["GET"])
def start():
    extract_frames(video_path, interval_sec=1)
    text = run_ocr_on_frames(directory)
    cool = llm_output(text)
    return cool

if __name__ == "__main__":    
    app.run(port=8081)

