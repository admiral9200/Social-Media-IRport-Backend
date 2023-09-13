const express = require('express');
const router = express.Router();
const voteController = require('../controller/vote');
const multer = require('multer');

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

router.post('/saveVote', upload.single('file_upload'), voteController.saveVote);

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

module.exports = router;