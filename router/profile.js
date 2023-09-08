const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile');

router.post('/createProfile', (req, res) => {
    return profileController.createProfile(req, res);
})