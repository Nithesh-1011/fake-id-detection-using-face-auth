require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const User = require('./models/User'); // Your User model

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// Cosine similarity function
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    if (normA === 0 || normB === 0) return 0;
    return dot / (normA * normB);
};

// Function to check if similar face embedding already exists
async function faceEmbeddingExists(newEmbedding, threshold = 0.9) {
    const users = await User.find({}, { faceEmbedding: 1, username: 1 });
    for (const user of users) {
        if (!user.faceEmbedding || user.faceEmbedding.length !== newEmbedding.length) continue;

        const similarity = cosineSimilarity(newEmbedding, user.faceEmbedding);
        if (similarity >= threshold) {
            return { exists: true, username: user.username, similarity };
        }
    }
    return { exists: false };
}

app.post('/signup', upload.single('faceImage'), async (req, res) => {
    const { username, password } = req.body;
    const imagePath = req.file?.path;

    if (!username || !password || !req.file) {
        if (imagePath) fs.unlinkSync(imagePath);
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const userExistsWithUsername = await User.findOne({ username });
        if (userExistsWithUsername) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ message: "Username already taken" });
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        fs.unlinkSync(imagePath);

        // Get face embedding from Python server
        const faceVerifyRes = await axios.post('http://localhost:5000/verify', { image: base64Image });
        const newFaceEmbedding = faceVerifyRes.data.embedding;

        if (!newFaceEmbedding || !Array.isArray(newFaceEmbedding)) {
            return res.status(400).json({ message: "Invalid face embedding received from Python." });
        }

        // Check if face embedding already exists
        const checkResult = await faceEmbeddingExists(newFaceEmbedding, 0.4);
        if (checkResult.exists) {
            return res.status(409).json({
                message: `Face already registered for user: ${checkResult.username} (similarity: ${checkResult.similarity.toFixed(3)})`
            });
        }

        // Save new user with hashed password and embedding
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            faceEmbedding: newFaceEmbedding
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("Signup error:", err.response ? err.response.data : err.message);
        if (err.response && err.response.data && err.response.data.error) {
            return res.status(err.response.status || 500).json({ message: err.response.data.error });
        }
        res.status(500).json({ message: "Signup failed due to an internal error" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password, faceImage } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (password) {
            // Password-based login
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid password" });
            return res.status(200).json({ message: "Login successful (password)" });
        } else if (faceImage) {
            // Face-based login
            const base64Image = faceImage; // Assuming the client sends base64 directly

            // Get face embedding from Python server
            const faceVerifyRes = await axios.post('http://localhost:5000/verify', { image: base64Image });
            const loginFaceEmbedding = faceVerifyRes.data.embedding;

            if (!loginFaceEmbedding || !Array.isArray(loginFaceEmbedding)) {
                return res.status(400).json({ message: "Invalid face embedding received from Python." });
            }

            if (!user.faceEmbedding || user.faceEmbedding.length !== loginFaceEmbedding.length) {
                return res.status(400).json({ message: "User has no registered face data." });
            }

            const similarity = cosineSimilarity(loginFaceEmbedding, user.faceEmbedding);

            const threshold = 0.10; // Adjust this threshold as needed
            if (similarity >= threshold) {
                return res.status(200).json({ message: `Login successful (face match - similarity: ${similarity.toFixed(3)})` });
            } else {
                return res.status(401).json({ message: `Face match failed (similarity: ${similarity.toFixed(3)})` });
            }
        } else {
            return res.status(400).json({ message: "Please provide either password or face image for login." });
        }

    } catch (err) {
        console.error("Login error:", err.response ? err.response.data : err.message);
        if (err.response && err.response.data && err.response.data.error) {
            return res.status(err.response.status || 500).json({ message: err.response.data.error });
        }
        res.status(500).json({ message: "Login failed due to an internal error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));