from flask import Flask, request, jsonify
from deepface import DeepFace
from PIL import Image
import base64
import io
import os

app = Flask(__name__)

@app.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    base64_image = data.get("image")

    if not base64_image:
        return jsonify({"error": "No image provided"}), 400

    try:
        if "," in base64_image:
            base64_data = base64_image.split(",")[1]
        else:
            base64_data = base64_image

        # Decode image and ensure it's RGB (remove alpha channel)
        image = Image.open(io.BytesIO(base64.b64decode(base64_data)))
        image = image.convert("RGB")  # <<< Fix: Convert RGBA to RGB
        image.save("temp.jpg")

        # Run DeepFace represent to get the embedding
        embedding_data = DeepFace.represent(img_path="temp.jpg", enforce_detection=True)
        embedding = embedding_data[0]["embedding"] if embedding_data else None

        os.remove("temp.jpg")

        if embedding is None:
            return jsonify({"error": "No face detected in the image or embedding could not be extracted."}), 400

        return jsonify({
            "embedding": embedding
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    # Ensure face_db exists (though we are not actively using it for 'find' in this revised approach)
    if not os.path.exists("face_db"):
        os.makedirs("face_db")

    app.run(port=5000)