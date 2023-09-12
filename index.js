const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const profileController = require('./controller/profile');
const xlsxController = require('./controller/xlsx');

// multer middleware...
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });

app.use((express.json({ limit: "30mb", extended: true})))
app.use((express.urlencoded({ limit: "30mb", extended: true})))
app.use(cors());

const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
const url = process.env.MONGODB_URL;

mongoose.connect(url, options)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.log(err));

app.use('/insert/xlsx', (req, res) => {
    return xlsxController.insertData(req, res);
})


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

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running PORT ${PORT}`));