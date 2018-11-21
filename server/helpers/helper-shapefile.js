const jsonfile = require('jsonfile')
const config = require('../azure/config');
let has_creds = config.azure.key1.match(/\d/)
const blobFetcher = require('../azure/blob-fetcher');

module.exports = {
  sendCountryShapefile: (countryName) => {
    return new Promise((resolve, reject) => {
      if (has_creds) {
        blobFetcher.fetchBlob(countryName)
          .then(resolve)
      } else {
        jsonfile.readFile('./public/shapefiles/countries/' + countryName, (err, file) => {
          resolve(file)
        })
      }
    })
  }
}
