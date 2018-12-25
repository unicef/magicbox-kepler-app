const jsonfile = require('jsonfile')
const config = require('../azure/config');
let has_creds = config.azure.topojson.key1.match(/\d/)
const blobFetcher = require('../azure/blob-fetcher');

function addIndicator(indicator, borderFile, countryName) {
  return new Promise((resolve, reject) => {
    if (has_creds) {
      blobFetcher.fetchBlob(indicator, countryName)
        .then(indicatorData => {

          indicatorData = JSON.parse(indicatorData)
          borderFile = JSON.parse(borderFile)
          const collectionName = Object.keys(borderFile.objects)[0]
          borderFile.objects[collectionName].geometries.forEach((g, i) => {
            g.properties[indicator] = indicatorData[i].sum
          })
          return resolve(borderFile)
        })
    } else {
      jsonfile.readFile('./public/' + indicator + '/' + countryName, (err, file) => {
        resolve(file)
      })
    }
  })
}

module.exports = {
  sendCountryShapefile: countryName => {
    return new Promise((resolve, reject) => {
      if (has_creds) {
        blobFetcher.fetchBlob('topojson', countryName)
          .then(results => {
            addIndicator('population', results, countryName)
            .then(resolve)
          })
      } else {
        jsonfile.readFile('./public/shapefiles/countries/' + countryName, (err, file) => {
          resolve(file)
        })
      }
    })
  }
}
