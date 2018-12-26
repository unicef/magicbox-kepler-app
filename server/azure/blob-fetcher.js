const azure = require('azure-storage');
const config = require('./config');
const helper = require('../helpers/helper-index')

module.exports = {
  /**
    * Retrieves list of blobs in an array
    * @return {Promise} fulfilled with an array of (country, deepestAdmin) tuples
    */
  listBlobs: async (blobKind) => new Promise((resolve, reject) => {
    const storageAccount = config.azure[blobKind].storageAccount
    const azureKey = config.azure[blobKind].key1
    const blobSvc = azure.createBlobService(storageAccount, azureKey);
    const containerName = config.azure[blobKind].containerName
    blobSvc.listBlobsSegmented(containerName, null, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const countryList = data.entries.reduce((list, entry) => {
          const codeAndLevel = { // each entry is a string like this "ABC_X.json" with ABC the country code and X the admin level
            countryCode: entry.name.substr(0, 3),
            adminLevel: entry.name.substr(4, 1),
          };
          list.push(codeAndLevel);
          return list;
        }, []);
        return resolve(
          helper.minifyCountryList(countryList)
        );
      }
    });
  }),

  /**
    * Retrieves a blob and saves it to a file
    * @return {Promise} fulfilled with a text string of blob contents
    */
  fetchBlob: async (blobKind, blobName) => new Promise((resolve, reject) => {
    const storageAccount = config.azure[blobKind].storageAccount
    const azureKey = config.azure[blobKind].key1
    const container = config.azure[blobKind].containerName
    const blobSvc = azure.createBlobService(storageAccount, azureKey);
    console.log(storageAccount, azureKey, container, blobName)
    blobSvc.getBlobToText(container, blobName, (err, data) => {
      if (err) {
        reject(err);
      } else {

        return resolve(data);
      }
    });
  })
}
