const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    faceEmbedding: { type: [Number] } // Array of numbers for the face embedding
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);