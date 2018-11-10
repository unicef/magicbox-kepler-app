const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const config = require('./config')
const default_map = require('./public/users/default/config')
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile')
const helper = require('./helpers/helper-user-map')
const blobFetcher = require('./azure/blob-fetcher');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({ limit: '250mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }))
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/default', function(req, res) {
  helper.check_user('default')
  .then(obj => {
    res.send(obj)
  })
  .catch(err => {
    console.log(err)
    res.send(default_map)
  })
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
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

router.get('/:user/samples', (req, res) => {
  let userFolder = req.params.user;
  jsonfile.readFile(`./${userFolder}/samples.json`, (err, obj) => {
    if (err) console.log(err);
    res.send(obj);
  });
})

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}...`))
