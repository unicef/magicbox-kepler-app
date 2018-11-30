const fs = require('fs');
const util = require('util');
const config = require('../config')
const mkdir = util.promisify(fs.mkdir);
const jsonfile = require('jsonfile');
const path = require('../config').default_path;
const decode = require('jwt-decode')

function createUserDir(email) {
  return new Promise((resolve, reject) => {
    mkdir(path + email)
      .then(resolve)
      .catch((err) => { if (err.code !== 'EEXIST') throw err; });
  });
}

function getUserMap(email) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(`${path + email}/config.json`, (err, obj) => {
      if (err) reject(err);
      return resolve(obj);
    });
  });
}

module.exports = {
  checkTokenIsValid: jwt => {
    const authErrors = {
      errors: []
    }
    if (jwt === 'default') {
      authErrors.errors.push('not a real token')
      return authErrors
    }

    const decodedToken = decode(jwt)
    const {email, idp, exp, iss} = decodedToken

    // Check token expiration
    const currentTime = new Date().getTime();
    if ((currentTime*1000) > exp) {
      authErrors.errors.push('expired')
    }
    // Check idp and iss match
    if (
      idp !== config.authProviderDetails.idp &&
      iss !== config.authProviderDetails.iss
    ) {
      authErrors.errors.push('iss and or idp incorrect')
    }
    // Check email domain
    const emailDomain = email.split(/@/)[1]

    if (!config.whiteListedDomains[emailDomain]) {
      authErrors.errors.push('email domain not whitelisted')
    }

    if (authErrors.errors.length > 0) {
      return authErrors
    }
    return decodedToken.email
  },

  checkUser: email => new Promise((resolve, reject) => {
    // Check user has directory
    fs.stat(path + email, (err, stat) => {
      if (err === null) {
        // User has dir
        getUserMap(email)
          .then(resolve)
          .catch(reject);
      } else {
        createUserDir(email)
          .then(resolve).catch(reject);
      }
    });
  }),
};
