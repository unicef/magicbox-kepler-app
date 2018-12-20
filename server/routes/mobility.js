const express = require('express');
const router = express.Router();
const helperMobility = require('../helpers/helper-mobility')
router.get('/countries', (req, res) => {
  helperMobility.listCountries()
    .then(result => res.send(result));
})

router.get('/countries/:countryCode/:adminLevel', (req, res) => {
  let fileName = "2017-12-25.csv";
  helperMobility.sendCountryMobilityData(req.params.countryCode, req.params.adminLevel, fileName)
    .then(result => res.send({data: result}));
})

module.exports = router;
