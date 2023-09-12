const Party = require('../models/Party');

exports.saveParty = async (req, res) => {
    console.log(req.body)
    const { name } = req.body;

    const newParty = new Party({
        name: name
    });

    newParty.save()
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            throw err;
        })
}

exports.getParties = async (req, res) => {
    const parties = await Party.find();
    if(parties) {
        return res.status(200).json({ parties });
    }
}