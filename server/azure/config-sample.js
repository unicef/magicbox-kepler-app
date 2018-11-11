module.exports = {
  server_port: 5000,

  // Azure-related
  remotePathToList: 'data',
  localStorageDir: 'data',
  connectionSettings: {
    host: 'ip_address',
    port: 22, // normal is port 22
    username: 'username',
    password: 'fill yours here'
  },
  azure: {
    storageAccount: 'topojson',
    key1: 'storage_key',
    containerName: 'gadm2-8'
  }
}
