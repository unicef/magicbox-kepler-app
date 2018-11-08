const fs = require('fs')
const util = require('util')
const mkdir = util.promisify(fs.mkdir)
const jsonfile = require('jsonfile')
const path = require('../config').default_path

function create_user_dir(email) {
  return new Promise((resolve, reject) => {
    mkdir(path + email)
      .then(resolve)
      .catch(err => { if (err.code != 'EEXIST') throw err;})
  })
}

function get_user_map(email) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(path + email + '/config.json', (err, obj) => {
      if (err) reject(err)
      return resolve(obj)
    })
  })
}

module.exports = {
  check_user: (email) => {
    return new Promise((resolve, reject) => {
      // Check user has directory
      fs.stat(path + email, (err, stat) => {
        if(err == null) {
          // User has dir
          get_user_map(email)
            .then(resolve)
            .catch(reject)
        } else {
          create_user_dir(email)
          .then(resolve).catch(reject)
        }
      });
    })
  }
}
