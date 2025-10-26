# video_to_frame.py
import cv2
import os
from  flask import Flask, jsonify
import easyocr
from openai import OpenAI


client = openai.Client("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")

app = Flask(__name__)
video_path = "./media/test.py"
directory = "extracted_frames"

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

    for filename in sorted(os.listdir(directory)):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):

            filepath = os.path.join(directory, filename)

            frame = cv2.imread(filepath)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            results = reader.readtext(frame_rgb)
            text = " ".join([entry[1] for entry in results])

            print(f"OCR for {filename}: {text}")
            
            return text

def llm_output(text):
    response = client.chat.completions.create(
        model ="gpt-4o-mini",
        messages={
            {"role": "user", "content": f"The user has pr {text}"},
            {"role": "system", "content": "You are a helpful assistant that summarizes text and explains it"}
        }
    )
    text = response.choices[0].message['content']
    return text


@app.route('/', method=["GET"])
def start():
    extract_frames(video_path, interval_sec=1)
    text = run_ocr_on_frames(directory)
    cool = llm_output(text)
    return cool

if __name__ == "__main__":    
    app.run(port=8081)

