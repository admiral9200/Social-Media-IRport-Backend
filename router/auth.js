const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');

router.post('/register', (req, res) => {
    return authController.register(req, res);
});

router.post('/login', (req, res) => {
    return authController.login(req, res);
})

router.post('/logout', (req, res) => {
    res.send("Auth Logout")
})

router.post('/forgotPassword', (req, res) => {
    return authController.forgotPassword(req, res);
})

router.post('/resetPassword', (req, res) => {
    return authController.resetPassword(req, res);
})

module.exports = router;