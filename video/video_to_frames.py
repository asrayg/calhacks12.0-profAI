# video_to_frame.py
import cv2
import os

# interval_sec is how often we want to capture frame
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

if __name__ == "__main__":    
    video_path = r"C:\Users\Arthur Lemus\Downloads\test_video.mp4"
    extract_frames(video_path, interval_sec=1)