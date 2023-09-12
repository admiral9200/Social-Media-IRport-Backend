const express = require('express');
const router = express.Router();
const xlsxController = require('../controller/xlsx');

router.get('/getAllElectionData', (req, res) => {
    return xlsxController.getAllElectionData(req, res);
});

router.get('/getCountries', (req, res) => {
    return xlsxController.getCountries(req, res);
})

router.post('/getStates',  (req, res) => {
    return xlsxController.getStates(req, res);
})

router.post('/getGovernments',  (req, res) => {
    return xlsxController.getGovernments(req, res);
})

router.post('/getWards',  (req, res) => {
    return xlsxController.getWards(req, res);
})

router.post('/getPolls',  (req, res) => {
    return xlsxController.getPolls(req, res);
})

module.exports = router;