const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const config = require('../config')
const jsonfile = require('jsonfile');
const default_map = require('../public/users/default/config');
const helper = require('../helpers/helper-user-map');

router.get('/default/:token', (req, res) => {
  if (req.params) {
    const tokenIsValidThenEmail = helper.checkTokenIsValid(config.params.token)
    if (tokenIsValidThenEmail) {
      helper.check_user(tokenIsValidThenEmail)
        .then((obj) => {
          if (obj) {
            res.send(obj);
          } else {
            res.send(default_map);
          }
        })
        .catch(err => {
          console.log(err);
          res.send(default_map);
        });
    // User is not authorized
    } else {
      console.log("DEFAULT")
      res.send(default_map);
    }

  }
});

router.route('/save/:token')
  .post((req, res) => {

    if (!config.saveable) {
      return res.send({
        message: 'Sorry, you cannot save a map'
      });
    }

    const tokenIsValidThenEmail = helper.checkTokenIsValid(config.params.token)

    if (!tokenIsValidThenEmail) {
      return res.send({
        message: 'Error: you are not authorized to save a map'
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
