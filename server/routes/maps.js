const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const config = require('../config')
const defaultMap = require('../public/users/default/config');
const helper = require('../helpers/helper-user-map');
const messageNotAuthorized = 'Error: you are not authorized to save a map.'
const mapSavedMessage = 'Saved! You may need to repoen your '
  + 'browser in incognito mode next time you retrieve.'
// User requests logs in and requests either their own maps
// if one was saved before, or a blank one
router.get('/default/:token', (req, res) => {
  if (req.params) {
    // Returns error or email
    const tokenCheck = helper.tokenIsValid(req.params.token)

    if (tokenCheck.errors) {
      return res.send(
        {error: 'unauthorized'}
      );
    }
    // Token is real
    helper.checkUser(tokenCheck.email)
      .then(mapConfig => {
        if (mapConfig) {
          return res.send(mapConfig);
        }
        // First time user, just send a default map
        return res.send(defaultMap);
      })
      .catch(err => {
        console.log(err);
        res.send(defaultMap);
    });

  }
});

router.route('/save/:token')
  .post((req, res) => {
    if (!config.saveable) {
      return res.send({
        message: messageNotAuthorized
      });
    }

    const tokenCheck = helper.tokenIsValid(req.params.token)
    // User not authorized
    if (tokenCheck.errors) {
      return res.send({
        message: messageNotAuthorized +
        ': ' +
        tokenCheck.errors
      });
    }

    // User is authorized to save map
    helper.saveUserMap(tokenCheck.email, req.body)
    .then(() => {
      res.send({
        message: mapSavedMessage
      });
    })
    .catch(err => {
      console.log(err)
      res.send({ message: 'Could not save' });
    })
  });

module.exports = router;
