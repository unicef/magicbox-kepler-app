const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const default_map = require('../public/users/default/config')
const jsonfile = require('jsonfile')
const helper = require('../helpers/helper-user-map')

router.get('/default/:email', function(req, res) {
  if (req.params) {
    helper.check_user(req.params.email)
    .then(obj => {
      if (obj) {
        res.send(obj)
      } else {
        res.send(default_map)
      }
    })
    .catch(err => {
      console.log(err)
      res.send(default_map)
    })
  }
});

router.route('/save/:email')
    .post((req, res) => {
      jsonfile.writeFile('./public/users/' + req.params.email + '/' + 'config.json', req.body, err => {
        if (err) {
          console.log(err)
          res.send({message: 'Could not save'})
        } else {
          res.send({message: 'Saved! You may need to repoen your ' +
            'browser in incognito mode next time you retrieve.'
        });
      }
    })
  });

module.exports = router;
