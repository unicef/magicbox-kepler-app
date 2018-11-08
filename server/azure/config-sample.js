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
    storage_account: [will be provided],
    key1: [will be provided],
    countainer_name: 'gadm2-8'
  }
}
