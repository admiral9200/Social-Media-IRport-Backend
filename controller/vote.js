const Grid = require('gridfs-stream');
const mongoose = require("mongoose");
const GridFsStorage = require('multer-gridfs-storage')
const { GridFSBucket, ObjectId  } = require('mongodb');

const Vote = require('../models/Vote');

// Create a connection to your MongoDB Atlas database
const conn = mongoose.createConnection(process.env.MONGODB_URL);

const saveVideoToGridFS = async (file) => {
    const bucket = new GridFSBucket(conn.db, { bucketName: 'media' });
    const uploadStream = bucket.openUploadStream(file.originalname);
    await uploadStream.write(file.buffer);
    await uploadStream.end();
    return uploadStream.id;
}

const streamVideoFromGridFS = async (fileId, res) => {
    const bucket = new GridFSBucket(conn.db, { bucketName: 'media' });
    const downloadStream = bucket.openDownloadStream(new ObjectId("6505b2e3711ea618c015b45d"));
    downloadStream.pipe(res);
}

// const streamVideoFromGridFS = async (fileId, res) => {
//     const bucket = new GridFSBucket(conn.db, { bucketName: 'media' });
//     const downloadStream = bucket.openDownloadStream(new ObjectId("6505b2e3711ea618c015b45d"));
    
//     downloadStream.on('data', (chunk) => {
//       res.write(chunk);
//     });
    
//     downloadStream.on('error', (error) => {
//       console.error(error);
//       res.sendStatus(404);
//     });
    
//     downloadStream.on('end', () => {
//       res.end();
//     });
//   };

exports.saveVote = async (req, res) => {
    try {
        const fileId = await saveVideoToGridFS(req.file);

        const { country, government, poll, state, userId, ward, localParties } = req.body;

        const newVote = new Vote({
            country,
            government,
            poll,
            state,
            userId,
            ward,
            localParties: JSON.parse(localParties),
            media: fileId
        });


        newVote.save()
            .then(data => {
                res.status(200).json({ data });
            })
            .catch(err => {
                throw err;
            });
        
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
}

exports.getTotalVotes = async (req, res) => {
    try {
        const votes = await Vote.find({ checked: true });
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
        const votes = await Vote.find({ checked: true });
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
        console.log(err)
        res.status(500).json({ err });
    }
}

exports.getVotersNumber = async (req, res) => {
    try {
        const votes = await Vote.find({ });

        res.status(200).json({ votersNumber: votes.length });
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.getVotes = async (req, res) => {
    try {
        const votes = await Vote.find({ checked: true });

        res.status(200).json({ votes });
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.getMedia = async (req, res) => {
    try {
        const fileId = req.body.mediaId;

        streamVideoFromGridFS(fileId, res)
            .catch(error => {
                console.log(error);
                res.status(500).json({ msg: "streaming media error!" });
            })
    } catch (err) {
        console.log("error: ", err);
    }
}

exports.pushToAdmin = async (req, res) => {
    try {
        const {id, agent } = req.body;

        await Vote.findOneAndUpdate(
            { _id: id },
            { toAdmin: true, agent: agent }
        )
        .then(updated => {
            res.status(200).json({ msg: "updated successfully!" });
        })
        .catch(err => {
            res.status(500).json({ msg: "error ocurred!" });
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.getAdmin = async (req, res) => {
    try {
        const { id } = req.body;

        await Vote.findOne({ _id: id })
            .then(vote => {
                if(vote.toAdmin) {
                    res.status(200).json({ msg: "Already Pushed!" });
                } else {
                    res.status(204).json({ msg: "Not Pushed Yet!" });
                }
            })
            .catch(err => {
                res.status(500).json({ msg: "error ocurred!" });
            }) 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.getCurrentVotes = async (req, res) => {
    try {
        const { agent, unitCount } = req.body;
        const data = await Vote.find().skip(agent).limit(unitCount);
        if(data) {
            res.status(200).json({ data })
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.getVotesToAdmin = async (req, res) => {
    try {
        const data = await Vote.find({ toAdmin: true });
        if(data) {
            res.status(200).json({ data });
        }
    } catch (err) {
        throw err;
    }
}

exports.setVoteCheck = async (req, res) => {
    try {
        const data = await Vote.findOneAndUpdate(
            { _id: req.body.id },
            { checked: true }
        )

        if(data) {
            res.status(200).json({ msg: "Successfully updated!" })
        }
    } catch (err) {
        throw err;
    }
}

exports.getCheckedStatus = async (req, res) => {
    try {
        const { id } = req.body;

        await Vote.findOne({ _id: id })
            .then(vote => {
                if(vote.checked) {
                    res.status(200).json({ msg: "Already Checed!" });
                } else {
                    res.status(204).json({ msg: "Not Checked Yet!" });
                }
            })
            .catch(err => {
                res.status(500).json({ msg: "error ocurred!" });
            }) 
    } catch (err) {
        console.log(err);
        throw err;
    }
}