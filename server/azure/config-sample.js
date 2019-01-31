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
      storageAccount: 'topojson',
      key1: 'asdf',
       //key1: 'asdf',
      containerName: 'gadm3-6'
    },
    population: {
      storageAccount: 'magicboxdata',
      key1: 'asdf',
       //key1: 'asdf',
      containerName: ''
    },
    healthsites: {
      storageAccount: 'magicboxdata',
      key1: 'asdf',
       //key1: 'asdf',
      containerName: 'healthsites'
    },
    schools: {
      storageAccount: 'magicboxdata',
      key1: 'asdf',
       //key1: 'asdf',
      containerName: 'schools-osm'
    }
  }
}
