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
        if (blobKind.match('users')) {
          return resolve(
            data.entries.map(e => { return e.name})
          )
        }
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
  saveBlob: async (blobKind, email, blob) => new Promise((resolve, reject) => {
    const storageAccount = config.azure[blobKind].storageAccount
    const azureKey = config.azure[blobKind].key1
    const container = config.azure[blobKind].containerName
    const blobSvc = azure.createBlobService(storageAccount, azureKey);

    blobSvc.createBlockBlobFromText(
        blobKind,
        email + '/config.json',
        JSON.stringify(blob),
        {},
        function onResponse(error, result) {
          console.log(error)
          console.log('errr')
          if (error) {
            return reject(error)
          }
          return resolve(true)
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
    blobSvc.getBlobToText(container, blobName, (err, data) => {
      if (err) {
        reject(err);
      } else {

        return resolve(data);
      }
    });
  })
}
