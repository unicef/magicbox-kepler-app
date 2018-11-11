let azure = require('azure-storage');

let config = require('./config');
let azureKey = config.azure.key1;
let storageAccount = config.azure.storageAccount;
let containerName = config.azure.containerName;
let blobSvc = azure.createBlobService(storageAccount, azureKey);
const helperHighestAdminLevel = require('../helpers/helper-highest-admin')
module.exports = {
  /**
    * Retrieves list of blobs in an array
    * @return {Promise} fulfilled with an array of (country, deepestAdmin) tuples
    */
  listBlobs: async () => {
    return new Promise((resolve, reject) => {
      blobSvc.listBlobsSegmented(containerName, null, (err, data) => {
        if (err) {
          reject(err);
        } else {
          let countryList = data.entries.reduce((countryList, entry) => {
            let codeAndLevel = { // each entry is a string like this "ABC_X.json" with ABC the country code and X the admin level
              countryCode: entry.name.substr(0, 3),
              adminLevel: entry.name.substr(4, 1)
            };
            countryList.push(codeAndLevel);
            return countryList;
          }, []);
          return resolve(
            helperHighestAdminLevel.minifyCountryList(countryList)
          );
        }
      });
    });
  },

  /**
    * Retrieves a blob and saves it to a file
    * @return {Promise} fulfilled with a text string of blob contents
    */
  fetchBlob: async (blobName) => {
    return new Promise((resolve, reject) => {
      blobSvc.getBlobToText(containerName, blobName, (err, data) => {
        if (err) {
          reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  },

}
