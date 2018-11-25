const fs = require('fs');
const util = require('util');
const config = require('../config')
const mkdir = util.promisify(fs.mkdir);
const jsonfile = require('jsonfile');
const path = require('../config').default_path;
const decode = require('jwt-decode')

function create_user_dir(email) {
  return new Promise((resolve, reject) => {
    mkdir(path + email)
      .then(resolve)
      .catch((err) => { if (err.code !== 'EEXIST') throw err; });
  });
}

function get_user_map(email) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(`${path + email}/config.json`, (err, obj) => {
      if (err) reject(err);
      return resolve(obj);
    });
  });
}

module.exports = {
  checkTokenIsValid: (jwt) => {
    const decodedToken = decode(jwt)
    const {email, idp, exp, iss} = decodedToken

    // Check token expiration
    const current_time = new Date().getTime() / 1000;
    if (current_time > exp) {
      return false
    }
    // Check idp and iss match
    if (
      idp !== config.authProviderDetails.idp &&
      iss !== config.authProviderDetails.iss
    ) { return false}
    // Check email domain
    const emailDomain = email.split(/@/)[1]
    if (
      config.whiteListedDomains.filter(domain => {
        return emailDomain === domain
      }).lenth === -1
    ) {
      return false
    }
    return decodedToken.email
  },

  check_user: email => new Promise((resolve, reject) => {
    // Check user has directory
    fs.stat(path + email, (err, stat) => {
      if (err === null) {
        // User has dir
        get_user_map(email)
          .then(resolve)
          .catch(reject);
      } else {
        create_user_dir(email)
          .then(resolve).catch(reject);
      }
    });
  }),
};
