module.exports = {
  server_port: 5000,

  // Azure-related
  remotePathToList: 'data',
  localStorageDir: 'data',
  connectionSettings: {
    host: 'ip_address',
    port: 22, // normal is port 22
    username: '[fill yours here]',
    password: '[fill yours here]'
  },
  azure: {
    topojson: {
      storageAccount: process.env.TOPOJSON_ACCOUNT || 'topojson',
      key1: process.env.TOPOJSON_ACCOUNT_KEY || 'asdf',
      containerName: process.env.TOPOJSON_CONTAINER || 'gadm3-6'
    },
    population: {
      storageAccount: process.env.POPULATION_ACCOUNT || 'magicboxdata',
      key1: process.env.POPULATION_ACCOUNT_KEY || 'asdf',
      containerName: process.env.POPULATION_CONTAINER || 'sedac-population'
    },
    healthsites: {
      storageAccount: process.env.HEALTHSITES_ACCOUNT || 'magicboxdata',
      key1: process.env.HEALTHSITES_ACCOUNT_KEY || 'asdf',
      containerName: process.env.HEALTHSITES_CONTAINER || 'healthsites'
    },
    schools: {
      storageAccount: process.env.SCHOOLS_ACCOUNT || 'magicboxdata',
      key1: process.env.SCHOOLS_ACCOUNT_KEY || 'asdf',
      containerName: process.env.SCHOOLS_CONTAINER || 'schools-osm'
    }
  }
}
