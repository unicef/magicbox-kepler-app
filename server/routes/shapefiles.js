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
  let getHealthSites = (req.query.healthsites == 'true');
  let getSchoolData = (req.query.schools == 'true');
  let countryCode = req.params.countryCode
  const fileName = `${countryCode}_${req.params.adminLevel}.json`;
  helperShapefile.sendCountryShapefile(fileName)
    .then(shapedata => {
      if (getHealthSites && !getSchoolData) {
        return helperShapefile.sendCountryHealthSites(countryCode, shapedata);
      } else if (!getHealthSites && getSchoolData) {
        return helperShapefile.sendCountrySchoolData(countryCode, shapedata);
      } else if(getHealthSites && getSchoolData) {
        return helperShapefile.sendCountryHealthSites(countryCode, shapedata)
          .then(ctryAndShapeData =>
            helperShapefile.sendCountrySchoolData(countryCode, ctryAndShapeData)
          );
      }else {
        res.send({ shapedata: shapedata });
      }
    })
    .then((results) => {
      res.send(results);
    })
    .catch(err => {
      console.log(err)
      res.send({ shapedata });
    });
});

module.exports = router;
