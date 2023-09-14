const Vote = require('../models/Vote');
const Media = require('../models/Media');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const conn = mongoose.connection;

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

exports.saveVote = async (req, res) => {
    try {
        
        const { country, government, poll, state, userId, ward, localParties } = req.body;
        console.log("req.body.localParties: ", JSON.parse(localParties));
        const media = req.file;

        const mediaInfo = new Media({
            fileName: media.filename,
            contentType: media.mimetype,
            uploadDate: new Date(),
            length: media.size,
            chunkSize: 1024 * 255
        })

        const savedMedia = await mediaInfo.save();

        const newVote = new Vote({
            country,
            government,
            poll,
            state,
            userId,
            ward,
            localParties: JSON.parse(localParties),
            media: savedMedia._id
        });


        newVote.save()
            .then(data => {
                res.status(200).json({ data });
            })
            .catch(err => {
                throw err;
            });
    } catch (err) {
        throw err;
    }
}

exports.getTotalVotes = async (req, res) => {
    try {
        const votes = await Vote.find({});
        let sum = 0;

        for (let i = 0; i < (await votes).length; i++) {
            sum += votes[i].localParties.reduce((total, obj) => total + parseInt(obj.value), 0);
        }

        res.status(200).json({ sum });
    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.getVotePercents = async (req, res) => {
    try {
        const votes = await Vote.find({});
        let sum = 0;
        let vote1 = 0;
        let vote2 = 0;
        let vote3 = 0;
        let vote4 = 0;
        let vote5 = 0;

        for (let i = 0; i < (await votes).length; i++) {
            sum += votes[i].localParties.reduce((total, obj) => total + parseInt(obj.value), 0);

            vote1 += parseInt(votes[i].localParties[0].value);
            vote2 += parseInt(votes[i].localParties[1].value);
            vote3 += parseInt(votes[i].localParties[2].value);
            vote4 += parseInt(votes[i].localParties[3].value);
            vote5 += parseInt(votes[i].localParties[4].value);
        }
        res.status(200).json({ percents: [vote1 / sum * 100, vote2 / sum * 100, vote3 / sum * 100, vote4 / sum * 100, vote5 / sum * 100] });
    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.getVotersNumber = async (req, res) => {
    try {
        const votes = await Vote.find({});

        res.status(200).json({ votersNumber: votes.length });
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.getVotes = async (req, res) => {
    try {
        const votes = await Vote.find({});

        res.status(200).json({ votes });
    } catch (error) {
        res.status(500).json({ error });
    }
}