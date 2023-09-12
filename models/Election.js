const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    sn: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    government: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    poll_unit_id: {
        type: Number,
        required: true
    },
    poll_units: {
        type: String,
        required: true
    },
    poll_unit_desc: {
        type: String,
        required: true
    }
})

const Election = mongoose.model("Election", ElectionSchema);

module.exports = Election;