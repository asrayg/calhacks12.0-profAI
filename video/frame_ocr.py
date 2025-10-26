# reading_image.py
import os
import cv2
import easyocr



def run_ocr_on_frames(directory):
    reader = easyocr.Reader(['en', 'es'])

    for filename in sorted(os.listdir(directory)):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):

            filepath = os.path.join(directory, filename)

            frame = cv2.imread(filepath)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            results = reader.readtext(frame_rgb)
            #print(results)
            
            # entry[0] are vector coordinates
            text = " ".join([entry[1] for entry in results])

            print(f"OCR for {filename}: {text}")

    
if __name__ == "__main__":
    directory = r"C:\Users\Arthur Lemus\Desktop\personal projects\Hackathon\extracted_frames"
    run_ocr_on_frames(directory)