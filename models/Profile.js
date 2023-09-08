const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    country: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
})

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;