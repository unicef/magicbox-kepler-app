module.exports = {
  server_port: 5000,

  // Azure-related
  remotePathToList: 'data',
  localStorageDir: 'data',
  connectionSettings: {
    host: 'ip_address',
    port: 22, // normal is port 22
    username: [fill yours here],
    password: [fill yours here]
  },
  azure: {
    storageAccount: [will be provided],
    key1: [will be provided],
    containerName: 'gadm2-8'
  }
}
