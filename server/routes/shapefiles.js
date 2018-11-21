const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const helperShapefileCountry = require('../helpers/helper-shapefile-country')
const helperShapefile = require('../helpers/helper-shapefile')
router.get('/countries', (req, res) => {
  helperShapefileCountry.listCountries()
    .then(result => res.send(result));
});

router.get('/countries/:countryCode/:adminLevel', (req, res) => {
  const fileName = `${req.params.countryCode}_${req.params.adminLevel}.json`;
  helperShapefile.sendCountryShapefile(fileName)
    .then(result => res.send(result));
});

module.exports = router;
