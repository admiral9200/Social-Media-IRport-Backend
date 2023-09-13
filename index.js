const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');

require('dotenv').config();

const profileController = require('./controller/profile');

// Multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const url = process.env.MONGODB_URL;

mongoose.connect(url, options)
    .then(() => console.log('Successfully connected to MongoDB Atlas'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.use('/auth', require('./router/auth'));

app.use('/profile/create', upload.single('file'), (req, res) => {
    return profileController.createProfile(req, res);
});

app.use('/profile/get', (req, res) => {
    return profileController.getProfile(req, res);
})

app.use('/election', require('./router/election'));

app.use('/party', require('./router/party'));

app.use('/vote', require('./router/vote'));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running PORT ${PORT}`));