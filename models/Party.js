const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Party = mongoose.model('Party', PartySchema);

module.exports = Party;