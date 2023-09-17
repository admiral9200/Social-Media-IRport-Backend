const express = require('express');
const router = express.Router();
const voteController = require('../controller/vote');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/saveVote', upload.single("file_upload"), voteController.saveVote);

router.get('/getTotalVotes', (req, res) => {
  return voteController.getTotalVotes(req, res);
})

router.get('/getVotePercents', (req, res) => {
  return voteController.getVotePercents(req, res);
})

router.get('/getVotersNumber', (req, res) => {
  return voteController.getVotersNumber(req, res);
})

router.get('/getVotes', (req, res) => {
  return voteController.getVotes(req, res);
})

router.post('/getMedia', (req, res) => {
  return voteController.getMedia(req, res);
})

router.post('/pushToAdmin', (req, res) => {
  return voteController.pushToAdmin(req, res);
})

router.post('/getAdmin', (req, res) => {
  return voteController.getAdmin(req, res);
})

router.post('/getCurrentVotes', (req, res) => {
  return voteController.getCurrentVotes(req,res);
})

router.get('/getVotesToAdmin', (req, res) => {
  return voteController.getVotesToAdmin(req, res);
})

router.post('/setVoteCheck', (req, res) => {
  return voteController.setVoteCheck(req, res);
})

router.post('/getCheckedStatus', (req, res) => {
  return voteController.getCheckedStatus(req, res);
})

module.exports = router;