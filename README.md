# Fake ID Detection using Face Auth

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![DeepFace](https://img.shields.io/badge/DeepFace-FFD43B?style=for-the-badge&logo=deepface&logoColor=black)](https://github.com/serengil/deepface)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Table of Contents

-   [About the Project](#about-the-project)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Setup and Installation](#setup-and-installation)
-   [Usage](#usage)
-   [Important Notes & Security Considerations](#important-notes--security-considerations)
-   [Contributing](#contributing)
-   [License](#license)

## About the Project

Detect fake IDs using Face Auth! This system captures and verifies unique facial biometrics (DeepFace/Python) against registered data via Node.js/MongoDB. It ensures a live face matches the digital ID, preventing fraud and unauthorized access through robust password or face login.

## Features

-   **User Registration (Signup):**
    -   Username and Password creation.
    -   **Face Image Capture:** Users can use their webcam to capture a face image.
    -   **Face Image Upload:** Users can upload an image file from their device.
    -   **Biometric Uniqueness Check:** Prevents multiple registrations with the same or highly similar face biometric data, crucial for preventing fake ID creation.
-   **User Login:**
    -   **Password-based Login:** Standard username and password verification.
    -   **Face-based Login:** Authenticates users by comparing their live captured/uploaded face with their registered biometric data to verify identity.
-   **Secure Authentication:**
    -   Passwords are cryptographically hashed using `bcryptjs`.
    -   Face embeddings are stored and compared using cosine similarity for biometric verification.
-   **Vibrant User Interface:**
    -   Modern, social media-inspired login/signup forms with animations.
    -   A dynamic social feed page for logged-in users, built with Tailwind CSS.
-   **Modular Backend:** Separate Node.js and Python services for clear separation of concerns, enhancing scalability and maintainability.

## Technologies Used

### Frontend
-   **HTML5:** Structure of web pages.
-   **CSS3:** Styling (custom CSS for login/signup, Tailwind CSS for the home page).
-   **JavaScript:** Client-side logic for camera interaction, form submissions, and UI toggling.
-   **Tailwind CSS:** Utility-first CSS framework for rapid UI development on `home.html`.
-   **Font Awesome:** For easily adding icons to buttons and UI elements.

### Backend (Node.js Express Server)
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web application framework for handling API routes.
-   **Mongoose:** ODM (Object Data Modeling) for MongoDB, simplifying database interactions.
-   **bcryptjs:** For hashing and salting passwords securely.
-   **Multer:** Middleware for handling `multipart/form-data`, primarily for file uploads.
-   **Axios:** Promise-based HTTP client for making requests to the Python server.
-   **dotenv:** For loading environment variables from a `.env` file.

### Face Recognition (Python Flask Server)
-   **Python:** Programming language for the face processing service.
-   **Flask:** Lightweight WSGI web application framework for the API.
-   **DeepFace:** A robust facial recognition and facial attribute analysis framework.
-   **Pillow (PIL Fork):** For image manipulation (e.g., ensuring RGB format).

### Database
-   **MongoDB:** NoSQL database for storing user accounts and face embeddings.

## Project Structure
signup-login-app/
├── face_db/                  # DeepFace model cache and internal data
│   └── ds_model_vggface/
├── models/
│   └── user.js               # Mongoose User schema and model
├── node_modules/             # Node.js dependencies
├── public/
│   ├── home.html             # Social media feed page (after login)
│   ├── index.css             # Styling for the login/signup page
│   └── index.html            # Login and Signup page
├── uploads/                  # Temporary storage for uploaded face images
├── .env                      # Environment variables (e.g., MONGO_URI)
├── face_server.py            # Python Flask server for DeepFace processing
├── package-lock.json         # Node.js dependency lock file
├── package.json              # Node.js project metadata and dependencies
├── requirements.txt          # Python dependencies
├── server.js                 # Main Node.js Express backend server
└── temp_debug.jpg            # (Optional) Temporary image file from DeepFace processing


## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v14 or higher recommended)
-   **npm** (comes with Node.js)
-   **Python** (v3.8 or higher recommended)
-   **pip** (comes with Python)
-   **MongoDB** (running locally or a cloud instance like MongoDB Atlas)
-   **A Font Awesome Kit:** Sign up at [fontawesome.com](https://fontawesome.com/) to get your kit URL.

## Setup and Installation

Follow these steps to get the project up and running:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd signup-login-app
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the root directory of your project (`signup-login-app/`).
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=3000 # Or any desired port for the Node.js server
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB connection string (e.g., `mongodb://localhost:27017/yourdbname` or your Atlas URI).

3.  **Install Node.js Dependencies:**
    Navigate to the project root and install npm packages:
    ```bash
    npm install
    ```

4.  **Install Python Dependencies:**
    Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
    *Note: DeepFace will download necessary models (like VGG-Face) into the `face_db` directory the first time it's run, which might take some time.*

5.  **Start the Python Flask Server:**
    In a new terminal window, navigate to the project root and run the Flask server:
    ```bash
    python face_server.py
    ```
    This server will run on `http://localhost:5000`. Keep this terminal open.

6.  **Start the Node.js Express Server:**
    In another terminal window, navigate to the project root and run the Express server:
    ```bash
    npm start
    ```
    Or
    ```bash
    node server.js
    ```
    This server will typically run on `http://localhost:3000` (or the `PORT` you specified in `.env`). Keep this terminal open.

7.  **Update Font Awesome Kit URL:**
    Open `public/index.html` and `public/home.html`.
    Replace `https://kit.fontawesome.com/your_fontawesome_kit.js` with your actual Font Awesome Kit URL.

## Usage

1.  Open your web browser and navigate to `http://localhost:3000` (or your chosen Node.js server port).
2.  You will see the **Login & Signup page**.
3.  **To Sign Up:**
    -   Enter a username and password.
    -   Click "Open Camera" to use your webcam and then "Capture" to take a photo, OR click "Upload Image" to select a file.
    -   Click "Sign Up". If the face is unique and registration is successful, you'll be redirected to the home page.
4.  **To Log In (Password):**
    -   If currently on the Signup form, click "Log in" at the bottom.
    -   Enter your registered username and password.
    -   Click "Log In".
5.  **To Log In (Face - *requires client-side modifications not fully implemented in provided frontend*):**
    -   Currently, the provided `index.html` only supports password login on the login form. To enable face login, you would extend the `login()` function in `public/index.html` to capture/upload a face image and send it as `faceImage` in the login request. This is critical for the "Fake ID Detection" aspect during login.
6.  **Home Page:**
    -   After successful login, you'll be redirected to `home.html`, where you'll see a mock social media feed and profile section.
7.  **Logout:**
    -   Click the "Logout" button on the `home.html` page to clear your session and return to the login screen.

## Important Notes & Security Considerations

### **🚨 Critical: Face Recognition Similarity Thresholds 🚨**
The current `cosineSimilarity` thresholds in `server.js` (`0.4` for signup, `0.10` for login) are **extremely low** and will likely lead to **very high false positive rates**, severely impacting the "Fake ID Detection" capability.

-   **Cosine similarity ranges from -1 (opposite) to 1 (identical).**
-   For reliable face recognition using embeddings, typical thresholds are much higher, often in the range of `0.6` to `0.9+`, depending on the DeepFace model used and your desired level of security.
-   **It is absolutely crucial to calibrate and test these thresholds rigorously** for your specific use case to balance strong security (low false positives/fake ID detection) with user convenience (low false negatives). Start with values like `0.75` or `0.8` and adjust based on your testing.

### DeepFace Models
-   The `deepface` library will automatically download necessary pre-trained models (e.g., VGG-Face) into the `face_db` directory the first time the `face_server.py` processes an image. This might cause a slight delay on the initial request.

### HTTPS
-   For any real-world application, especially one dealing with sensitive biometric data, **always use HTTPS**. This setup is for development; deploy with proper SSL/TLS certificates in production.

### Environment Variables
-   Never commit your `.env` file to version control (e.g., Git). It contains sensitive information. Add `.env` to your `.gitignore` file.

### Error Handling
-   The current error handling provides `alert()` messages. For a production-ready application, consider more sophisticated user feedback mechanisms (e.g., toasts, in-page messages, modals).

## Contributing

Feel free to fork this repository, submit pull requests, or open issues if you have suggestions or find bugs.
