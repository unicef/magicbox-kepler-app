const jsonfile = require('jsonfile')
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => {
  let userFolder = req.params.user;
//  jsonfile.readFile(`./${userFolder}/samples.json`, (err, obj) => {
  jsonfile.readFile('./samples/samples.json', (err, obj) => {
    if (err) console.log(err);
    res.send(obj);
  });
})

module.exports = router;
