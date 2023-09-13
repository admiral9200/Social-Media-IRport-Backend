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
        required: true
    }
}, { timestamps: true })

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;