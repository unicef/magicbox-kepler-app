const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const config = require('./config')
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile')


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({limit: '250mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '250mb', extended: true}))
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/default', function(req, res) {
  res.send(config)
});

router.route('/save')
    .post(function(req, res) {
      jsonfile.writeFile('config.json', req.body, err => {
        if (err) {
          res.send({message: 'Could not save'})
        } else {
          res.send({message: 'Saved! You may need to repoen your ' +
            'browser in incognito mode next time you retrieve.'
          })
        }
      })
    });

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}...`))
