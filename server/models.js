
const mongoose = require('mongoose');

require('dotenv').config();

// Get the connection string from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log("MongoDB connected"))

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    privateKey: String,
    publicKey: String
})

const userModel = mongoose.model("users", UserSchema);

module.exports = {
    userModel
}