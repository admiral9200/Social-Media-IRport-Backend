const mongoose = require('mongoose');
const Grid = require('gridfs-stream');


// // Create a MongoDB connection
// const conn = mongoose.createConnection("mongodb+srv://lion9200world:kalid92413@cluster0.aqblem9.mongodb.net/");

// // Initialize GridFS
// let gfs;

// const initializeGridFS = () => {
//     console.log("created gfs: ")
//     return new Promise((resolve, reject) => {
//         conn.once('open', () => {
//             console.log("gfs connection OK")
//             gfs = Grid(conn.db, mongoose.mongo);
//             gfs.collection('uploads');
//             resolve(gfs);
//         });
//         conn.on('error', (error) => {
//             reject(error);
//         });
//     });
// };

// // Set up Multer for file upload
// const storage = multer.memoryStorage();


// module.exports = { upload }