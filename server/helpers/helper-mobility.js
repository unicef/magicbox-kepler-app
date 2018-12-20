const fs = require('fs');
let config = require('../azure/config');
let has_creds = config.azure.key1.match(/\d/);
const blobFetcher = require('../azure/blob-fetcher');
const helperIndex = require('./helper-index');
const jsonfile = require('jsonfile');
const topoJSON = require('topojson-client');
const turf = require('@turf/turf');

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
                };
            }
        })
}

function prepareListCountries(files) {
    let countryList = files.reduce((array, file)=>{
        fs.readFileSync(`./public/mobility/${file}`)
            .toString().split('\n')
            .forEach( content => {
                adminData = content.split(',')[0].split('_');
                let countryCode = adminData[0];
                if (countryCode.length > 0 && countryCode !== 'orig') {
                    array.push({
                        countryCode: countryCode,
                        adminLevel: adminData.length - 3
                    });
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

function prepareMobilityData(countryCode, adminLevel, centriodFile) {
    if (Object.keys(countryCentriods).length === 0) {
        initializeCentriods();
    }
    const shapeFile = `${countryCode.toUpperCase()}_${adminLevel}.json`;
    return jsonfile.readFile('./public/shapefiles/countries/' + shapeFile)
        .then((file) => {
            let geojson = topoJSON.feature(file, file.objects.collection);
            return setCoordinates ( countryCode, adminLevel, geojson, centriodFile );
        })
        .catch(error => {
            return setCoordinates ( countryCode, adminLevel, null, centriodFile );
        });
}

function setCoordinates(countryCode, adminLevel, geojson, file) {
    return fs.readFileSync(`./public/mobility/${file}`)
        .toString().split('\n')
        .filter( entry => {
            let origin = entry.split(',')[0].split('_');
            return origin[0] === countryCode || origin[0] === 'orig';
        }).map(entry => {
            let entryArray = entry.split(',');
            let origin = entryArray[0].split('_');
            let orginCtryCode = origin[0];

            let destination = entryArray[1].split('_');
            if (orginCtryCode !== undefined && orginCtryCode !== 'orig' &&
             destination[0] !== undefined && destination[0] !== 'dest') {
                if (geojson && Number(adminLevel) > 0) {
                    return setCoordinatesFromShapeFile(geojson, adminLevel, origin, destination, entryArray);
                } else {
                    return setCoordinatesFromCentriodFile(orginCtryCode, adminLevel, destination, entryArray);
                }
            }
            return `orig_lat,orig_long,dest_lat,dest_long,${entryArray[2]}`
        }).join('\n');
}

function setCoordinatesFromShapeFile(geojson, adminLevel, origin, destination, entryArray) {
    let originAdmLvl = origin[Number(adminLevel) + 1];
    if(!Number(originAdmLvl)) {
        return;
    }

    let coordinates = geojson.features.find(feature => {
            return feature.properties[`ID_${adminLevel}`] === Number(originAdmLvl);
        }).geometry.coordinates;
    let polygon = turf.polygon(coordinates.length > 1 ? coordinates[0] : coordinates);
    let centriod = turf.centroid(polygon);

    return centriod.geometry.coordinates[0] + ',' +
        centriod.geometry.coordinates[1] + ',' +
        countryCentriods[destination[0].toUpperCase()].longitute + ',' +
        countryCentriods[destination[0].toUpperCase()].latitude + ',' + entryArray[2];
}

function setCoordinatesFromCentriodFile(orginCtryCode, adminLevel, destination, entryArray) {
    if(Number(adminLevel) > 0){
        return;
    }

    return countryCentriods[orginCtryCode.toUpperCase()].longitute + ',' +
        countryCentriods[orginCtryCode.toUpperCase()].latitude + ',' +
        countryCentriods[destination[0].toUpperCase()].longitute + ',' +
        countryCentriods[destination[0].toUpperCase()].latitude + ',' + entryArray[2];
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

    sendCountryMobilityData: (countryCode, adminLevel, file) => {
        return new Promise((resolve, reject) => {
            if (has_creds) {
                blobFetcher.fetchBlob(countryCode)
                    .then(resolve)
            } else {
                resolve(
                    prepareMobilityData(countryCode, adminLevel, file)
                );
            }
        })
    }
};