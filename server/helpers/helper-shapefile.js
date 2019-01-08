const jsonfile = require('jsonfile')
const config = require('../azure/config');
const fs = require('fs')
let has_creds = config.azure.topojson.key1.match(/\d/)
let has_health_creds = config.azure.healthsites.key1.match(/\d/);
const blobFetcher = require('../azure/blob-fetcher');

function getIndicator(indicator, countryName) {
  return new Promise((resolve, reject) => {
    if (has_creds) {
      blobFetcher.fetchBlob(indicator, countryName)
        .then(indicatorData => {
          return resolve(indicatorData)
        })
    } else {
      let path = './public/' + indicator + '/' + countryName
      fs.readFile(path, (err, file) => {
        resolve(file)
      })
    }
  })
}

module.exports = {
  sendCountryShapefile: countryName => {
    return new Promise((resolve, reject) => {
      getIndicator('topojson', countryName)
      .then(borderFile => {
        borderFile = JSON.parse(borderFile)
        extraIndicators = ['population']
        const promises = extraIndicators.reduce((proms, indicator) => {
          proms.push(
            getIndicator(indicator, countryName)
          )
          return proms
        }, [])
        Promise.all(promises).then(values => {
          values.forEach((dataset, index) => {
            dataset = JSON.parse(dataset)
            const collectionName = Object.keys(borderFile.objects)[0]
            borderFile.objects[collectionName].geometries.forEach((g, i) => {
              g.properties[extraIndicators[index]] = dataset[i].sum
            })
          })
          return resolve(borderFile)
        });
      })
    })
  },
  sendCountryHealthSites: countryName => {
    return new Promise((resolve, reject) => {
      let file = `${countryName}.csv`;
      if (has_health_creds) {
        blobFetcher.fetchBlob('healthsites', file)
          .then(healthData => {
            return resolve(healthData);
          })
      } else {
        let path = `./public/healthsites/${file}`;
        fs.readFile(path, {encoding: 'utf8'}, (err, file) => {
          resolve(file);
        })
      }
    });
  }
}
