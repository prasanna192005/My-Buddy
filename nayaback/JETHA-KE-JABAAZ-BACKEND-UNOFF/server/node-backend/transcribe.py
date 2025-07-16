import whisper
import sys

model = whisper.load_model("base")
result = model.transcribe(sys.argv[1])  # Pass the audio file as a command-line argument
print(result["text"])  # Output the transcription
