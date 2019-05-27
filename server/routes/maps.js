const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const config = require('../config')
const helper = require('../helpers/helper-user-map');
const messageNotAuthorized = 'Error: you are not authorized to save a map.'
// User requests logs in and requests either their own maps
// if one was saved before, or a blank one
router.get('/default', (req, res) => {
  if (req.params) {
  // if (true) {
    // Returns error or email
    const tokenCheck = helper.tokenIsValid(req.headers['x-access-token'])
    if (tokenCheck.errors) {
      return res.send(
        {error: 'unauthorized'},
      );
    }
    helper.checkUser(tokenCheck.email)
      .then(mapConfig => {
        if (mapConfig) {
          return res.send(mapConfig);
        }
        // First time user, just send a default map
        return res.send({error: 'no default map'});
      })
      .catch(err => {
        console.log(err);
        res.send({error: 'no default map'});
    });

  }
});

router.get('/verify', (req, res) => {
  console.log("verify/token")
  if (req.params) {
  const tokenCheck = helper.tokenIsValid(req.headers['x-access-token'])
    const authorized = Boolean(tokenCheck.email)
    return res.send(
      {
        authorized
      }
    );
  }
});

router.route('/save')
  .post((req, res) => {
    if (!config.saveable) {
      return res.send({
        message: messageNotAuthorized
      });
    }
    // console.log("save req header", req.headers['x-access-token'])
    const tokenCheck = helper.tokenIsValid(req.headers['x-access-token'])
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
    .then((mapSavedMessage) => {
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
