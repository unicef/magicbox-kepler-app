const fs = require('fs')
let config = require('../azure/config');
let has_creds = config.azure.key1.match(/\d/)
const blobFetcher = require('../azure/blob-fetcher');
const helperIndex = require('./helper-index')
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

  return helperIndex.minifyCountryList(countryList)
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
  listCountries: () => {
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
}
