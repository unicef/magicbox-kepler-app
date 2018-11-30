const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const config = require('../config')
const jsonfile = require('jsonfile');
const default_map = require('../public/users/default/config');
const helper = require('../helpers/helper-user-map');

// User requests logs in and requests either their own maps
// if one was saved before, or a blank one
router.get('/default/:token', (req, res) => {
  if (req.params) {
    const tokenIsValidThenEmail = helper.checkTokenIsValid(req.params.token)

    if (tokenIsValidThenEmail.errors) {
      console.log(tokenIsValidThenEmail.errors)
      // A hack that I'm using for the test.
      default_map.info.unauthorized = true
      return res.send(default_map);
    }
      // Token is real
      helper.checkUser(tokenIsValidThenEmail)
        .then(obj => {
          if (obj) {
            return res.send(obj);
          }
          return res.send(default_map);
        })
        .catch(err => {
          console.log(err);
          res.send(default_map);
      });

  }
});

router.route('/save/:token')
  .post((req, res) => {
    if (!config.saveable) {
      return res.send({
        message: 'Sorry, you cannot save a map'
      });
    }

    const tokenIsValidThenEmail = helper.checkTokenIsValid(req.params.token)

    if (tokenIsValidThenEmail.errors) {
      return res.send({
        message: 'Error: you are not authorized to save a map:' + tokenIsValidThenEmail.errors
      });
    }

    jsonfile.writeFile(`./public/users/${tokenIsValidThenEmail}/` + 'config.json', req.body, (err) => {
      if (err) {
        console.log(err);
        res.send({ message: 'Could not save' });
      } else {
        res.send({
          message: 'Saved! You may need to repoen your '
            + 'browser in incognito mode next time you retrieve.'
        });
      }
    });
  });

module.exports = router;
