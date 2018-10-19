let azure = require('azure-storage');
let jsonfile = require('jsonfile');

let config = require('../../config');
let azureKey = config.azure.key1;
let storageAccount = config.azure.storageAccount;
let containerName = config.azure.containerName;

let blobSvc = azure.createBlobService(storageAccount, azureKey);

/**
  * Retrieves list of blobs in a collection
  * @return {Promise} fulfilled with an array of blob names
  */
export const listBlobs = async () => {
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

        // keep just the deepest adminLevel
        // the array is sorted e.g. ABW_0, AFG_0, AFG_1, AFG_2, AGO_0, AGO_1, AGO_2, AGO_3, AIA_0, etc. so by selecting the entry right before the countryCode switches, we obtain the entry with the deepest adminLevel
        let minifiedCountryList = countryList.filter((entry, index) => {
          if (index === countryList.length - 1) {
            return countryList[index].countryCode;
          } else {
            return entry.countryCode !== countryList[index + 1].countryCode;
          }
        });
        // console.log('minifiedCountryList', minifiedCountryList);
        return resolve(minifiedCountryList);
      }
    });
  });
};

/**
  * Retrieves a blob and saves it to a file
  * @return {Promise} fulfilled with a string of blob contents
  */
export const saveBlob = async (blobName) => {
  return new Promise((resolve, reject) =>{
    blobSvc.getBlobToText(containerName, blobName, (err, data) => {
      if (err) {
        reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};
