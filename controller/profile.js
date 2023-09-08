const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
    const { country, name, timezone, currency } = req.body;
    let picture = '';

    if(req.file) {
        picture = await req.file.fileName;
    }
    console.log("picture: ", picture);
    const newProfile = new Profile({
        user: req.body.id,
        country,
        name,
        picture: "route",
        timezone,
        phone: req.body.phoneNumber,
        currency
    });

    newProfile.save()
        .then(savedProfile => {
            res.status(201).json(savedProfile);
        })
        .catch(err => {
            console.log("Failed to save profile: ", err);
            res.status(500).json({ msg: 'Failed to save profile' });
        })
}

exports.getProfile = async (req, res) => {
    // console.log("get profile: ", req);
    const id = "64fad4463584ba0486830329";
    const profile = await Profile.findOne({ user: id });
    if(profile) {
        return res.status(200).json({ profile });
    }
}