const fs = require('fs');
let config = require('../azure/config');
let has_creds = config.azure.key1.match(/\d/);
const blobFetcher = require('../azure/blob-fetcher');
const helperIndex = require('./helper-index');

var countryCentriods = {};

function initializeCentriods() {
    fs.readFileSync('./public/mobility/country_centroids_az8.csv')
        .toString().split('\n')
        .forEach( content => {
            let contentArray = content.split(',');
            let long = contentArray[66];
            let lat = contentArray[67];
            let countryCode = contentArray[12];
            if (countryCode !== undefined && countryCode !== 'sov_a3') {
                countryCentriods[countryCode] = {
                        longitute: long,
                        latitude: lat
                    }
            }
        })
}

function prepareListCountries(files) {
    let countryList = files.reduce((array, file)=>{
        fs.readFileSync(`./public/mobility/${file}`)
            .toString().split('\n')
            .forEach( content => {
                let countryCode = content.split(',')[0].split('_')[0];
                if (countryCode.length > 0 && countryCode !== 'orig') {
                    array.push({ countryCode: countryCode });
                }
            });
        return array;
    }, []);

    countryList.sort((a, b) => {
        let codeA = a.countryCode.toLowerCase();
        let codeB = b.countryCode.toLowerCase();
        if (codeA > codeB) return 1;
        if (codeA < codeB) return -1;
        return 0;
      });

    return helperIndex.minifyCountryList(countryList);
}

function prepareMobilityData(countryCode, file) {

    if (Object.keys(countryCentriods).length === 0) {
        initializeCentriods()
    }
    return fs.readFileSync(`./public/mobility/${file}`)
        .toString().split('\n')
        .filter( entry => {
            let origin = entry.split(',')[0].split('_');
            return origin[0] === countryCode || origin[0] === 'orig';
        }).map(entry => {
            let entryArray = entry.split(',');
            let origin = entryArray[0].split('_');
            let destination = entryArray[1].split('_');
            if (origin[0] !== undefined && origin[0] !== 'orig' &&
             destination[0] !== undefined && destination[0] !== 'dest') {
                return countryCentriods[origin[0].toUpperCase()].longitute + ',' +
                    countryCentriods[origin[0].toUpperCase()].latitude + ',' +
                    countryCentriods[destination[0].toUpperCase()].longitute + ',' +
                    countryCentriods[destination[0].toUpperCase()].latitude + ',' + entryArray[2];
            }
            return `orig_lat,orig_long,dest_lat,dest_long,${entryArray[2]}`
        }).join('\n');
}

module.exports = {
    listCountries: () => {
        return new Promise((resolve, reject) => {
            if (has_creds) {
                blobFetcher.listBlobs()
                    .then(resolve);
            } else {
                fs.readdir('./public/mobility', (err, files) => {
                    resolve(
                        prepareListCountries(files)
                    );
                });
            };
        })
    },

    sendCountryMobilityData: (countryCode,file) => {
        return new Promise((resolve, reject) => {
            if (has_creds) {
                blobFetcher.fetchBlob(countryCode)
                    .then(resolve)
            } else {
                resolve(
                    prepareMobilityData(countryCode, file)
                );
            }
        })
    }
};