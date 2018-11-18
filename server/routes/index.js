const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = router;
