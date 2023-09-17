const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const profileController = require('./controller/profile');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const url = process.env.MONGODB_URL;
const PORT = process.env.PORT;

mongoose.connect(url, options)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
    })
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.use('/auth', require('./router/auth'));

app.use('/profile/create', (req, res) => {
    return profileController.createProfile(req, res);
});

app.use('/profile/get', (req, res) => {
    return profileController.getProfile(req, res);
})

app.use('/election', require('./router/election'));

app.use('/party', require('./router/party'));

app.use('/vote', require('./router/vote'));