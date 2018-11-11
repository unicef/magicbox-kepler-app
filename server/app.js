const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser');
const maps = require('./routes/maps');
const index = require('./routes/index');
const shapefiles = require('./routes/shapefiles');
const samples = require('./routes/samples');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json({ limit: '250mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '250mb', extended: true }))


app.use('/api/maps', maps);
app.use('/api/samples', samples);
app.use('/api/shapefiles', shapefiles);

app.use('/', index);

// app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}...`))
