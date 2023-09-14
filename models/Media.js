const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    chunkSize: {
        type: Number,
        required: true
    }
})

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;