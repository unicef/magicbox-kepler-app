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
  let countryCode = req.params.countryCode
  const fileName = `${countryCode}_${req.params.adminLevel}.json`;

  let promises = [
    helperShapefile.getCountryShapefile(fileName)
  ]

  if (req.query.healthsites == 'true') {
    promises.push(
      helperShapefile.getPoints('healthsites', countryCode)
    )
  }
  if (req.query.schools == 'true') {
    promises.push(
      helperShapefile.getPoints('schools', countryCode)
    )
  }

  Promise.all(promises)
  .then(values => {
    const hash = values.reduce((h, k) => {
                h[k.name] = k.data
                return h
              }, {})
              console.log(hash)
    res.send(
      hash
    );
  })
});

module.exports = router;
