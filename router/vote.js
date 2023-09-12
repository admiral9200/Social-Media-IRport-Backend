const express = require('express');
const router = express.Router();
const voteController = require('../controller/vote');

router.post('/saveVote', (req, res) => {
    return voteController.saveVote(req, res);
});

router.get('/getTotalVotes', (req, res) => {
    return voteController.getTotalVotes(req, res);
})

router.get('/getVotePercents', (req, res) => {
    return voteController.getVotePercents(req, res);
})

router.get('/getVotersNumber', (req, res) => {
    return voteController.getVotersNumber(req, res);
})

module.exports = router;