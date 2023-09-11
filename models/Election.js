const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
})

const Election = mongoose.model("Election", ElectionSchema);

module.exports = Election;