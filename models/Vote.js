const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    government: {
        type: String,
        required: true
    },
    poll: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    localParties: {
        type: Array,
        required: false
    },
    toAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    agent: {
        type: String,
        required: false,
        default: ""
    },
    // type of vote - (vote count, vote buying)
    genre: {
        type: String,
        required: false,
        default: "vote count"
    },
    // Checking by Admin
    checked: {
        type: Boolean,
        required: true,
        default: false
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: false
    }
}, { timestamps: true })

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;