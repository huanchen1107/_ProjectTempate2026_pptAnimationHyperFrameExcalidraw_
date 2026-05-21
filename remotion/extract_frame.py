import cv2
import sys

def extract_exact_frame(video_path, frame_number, output_image_path):
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video {video_path}")
        sys.exit(1)

    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
    
    ret, frame = cap.read()
    
    if ret:
        cv2.imwrite(output_image_path, frame)
        print(f"Successfully extracted exact frame {frame_number} to {output_image_path}")
    else:
        print(f"Error: Could not extract frame {frame_number}")
        
    cap.release()

if __name__ == "__main__":
    # The composition starts at 112 seconds (112 * 30 fps = frame 3360).
    # "frame 100" of the composition is exactly frame 3460 of the raw video.
    extract_exact_frame("public/video.mp4", 3460, "public/static_background.png")
