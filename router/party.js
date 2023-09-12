const express = require('express');
const router = express.Router();
const partyController = require('../controller/party');

router.post('/saveParty', (req, res) => {
    return partyController.saveParty(req, res);
});

router.get('/getParties', (req, res) => {
    return partyController.getParties(req, res);
});

module.exports = router;