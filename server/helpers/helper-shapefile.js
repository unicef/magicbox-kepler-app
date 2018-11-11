const fs = require('fs')
const jsonfile = require('jsonfile')
let config = require('../azure/config');
let azureKey = config.azure.key1;
const has_creds = azureKey.match(/\d/)
const helperHighestAdminLevel = require('../helpers/helper-highest-admin')
const helperAzureStorage = require('./helper-azure-storage')
const blobFetcher = require('../azure/blob-fetcher');

function prepareListCountries(files) {
  let countryList = files.reduce((ary, file) => {
      [countryCode, adminLevel] = file.replace('.json', '').split('_')
      console.log(countryCode, adminLevel)
    ary.push(
      {
        countryCode: countryCode,
        adminLevel: adminLevel.toString()
      }
    )
    return ary
  }, [])

  return helperHighestAdminLevel.minifyCountryList(countryList)
}

function listCountries() {
  return new Promise((resolve, reject) => {
    // User has azure blob storage credentials
    if (has_creds) {
      blobFetcher.listBlobs()
        .then(resolve);
    } else {
      fs.readdir('./public/shapefiles/countries', (err, files) => {
        resolve(
          prepareListCountries(files)
        )
      })
    }
  })
}

function adminLevel(email) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(path + email + '/config.json', (err, obj) => {
      if (err) reject(err)
      return resolve(obj)
    })
  })
}

module.exports = {
  listCountries: (email) => {
    return new Promise((resolve, reject) => {
        listCountries()
          .then(resolve)
    })
  },
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
