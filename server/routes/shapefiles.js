const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const blobFetcher = require('../azure/blob-fetcher');
router.get('/countries', (req, res) => {
  blobFetcher.listBlobs()
    .then(result => res.send(result));
})

router.get('/countries/:countryCode/:adminLevel', (req, res) => {
  let blobName = req.params.countryCode + "_" + req.params.adminLevel + ".json";
  console.log(blobName);
  blobFetcher.saveBlob(blobName)
    .then(res => JSON.parse(res)) // transform from text string to json object
    .then(result => res.send(result));
})

module.exports = router;
