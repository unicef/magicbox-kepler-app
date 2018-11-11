const bodyParser = require('body-parser');
const express = require('express');
const jsonfile = require('jsonfile');

const blobFetcher = require('./azure/blob-fetcher');
const config = require('./config');

const port = process.env.PORT || 5000;

const app = express();
const router = express.Router(); // get an instance of the express Router

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({ limit: '250mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }));

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/default', (req, res) => {
  res.send(config);
});

router.route('/save')
  .post((req, res) => {
    jsonfile.writeFile('config.json', req.body, (err) => {
      if (err) res.send({ message: 'Could not save' });
      else {
        res.send({
          message: 'Saved! You may need to repoen your '
            + 'browser in incognito mode next time you retrieve.',
        });
      }
    });
  });

router.get('/countries', (req, res) => {
  blobFetcher.listBlobs()
    .then(result => res.send(result));
});

router.get('/countries/:countryCode/:adminLevel', (req, res) => {
  const blobName = `${req.params.countryCode}_${req.params.adminLevel}.json`;
  blobFetcher.saveBlob(blobName)
    .then(response => JSON.parse(response)) // transform from text string to json object
    .then(result => res.send(result));
});

router.get('/:user/samples', (req, res) => {
  const userFolder = req.params.user;
  jsonfile.readFile(`./${userFolder}/samples.json`, (err, obj) => {
    if (err) res.send({ message: 'Could not load sample maps' });
    else res.send(obj);
  });
});

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}...`));
