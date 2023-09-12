const Election = require('../models/Election');
const path = require('path');
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