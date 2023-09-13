const Election = require('../models/Election');
const xlsx = require('xlsx');

exports.insertData = async (req, res) => {
  try {
    const workbook = xlsx.readFile('data/Imo.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const result = await Election.insertMany(data, { ordered: false });
    console.log(result.length + " documents inserted!");
    res.json({ msg: "inserted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
}

exports.getAllElectionData = async (req, res) => {
  try {
    const data = await Election.find();
    if (data) {
      return res.status(200).json({ data });
    }
  } catch (err) {
    throw err;
  }
}

exports.getCountries = async (req, res) => {
  try {
    const countries = await Election.distinct('country');
    if (countries) {
      res.status(200).json({ countries })
    }
  } catch (err) {
    throw err;
  }
}

exports.getStates = async (req, res) => {
  try {
    const states = await Election.distinct('state', { country: req.body.country });
    if (states) {
      res.status(200).json({ states });
    }
  } catch (err) {
    throw err;
  }
}

exports.getGovernments = async (req, res) => {
  try {
    const governments = await Election.distinct('government', { country: req.body.params.country, state: req.body.params.state });
    if (governments) {
      
      res.status(200).json({ governments });
    }
  } catch (err) {
    throw err;
  }
}

exports.getWards = async (req, res) => {
  try {
    const wards = await Election.distinct('ward', { country: req.body.params.country, state: req.body.params.state, government: req.body.params.government });
    if (wards) {
      res.status(200).json({ wards });
    }
  } catch (err) {
    throw err;
  }
}

exports.getPolls = async (req, res) => {
  try {
    const polls = await Election.distinct('poll_units', { country: req.body.params.country, state: req.body.params.state, government: req.body.params.government, ward: req.body.params.ward });
    if (polls) {
      res.status(200).json({ polls });
    }
  } catch (err) {
    throw err;
  }
}