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
    const target = config.sendDefaultToAuthorizedUsers ? 'default' : email
    jsonfile.readFile(`${path + target}/config.json`, (err, obj) => {
      if (err) reject(err);
      return resolve(obj);
    });
  });
}

function checkExpired(exp) {
  // Check token expiration
  const currentTime = new Date().getTime();
  console.log(new Date(currentTime), exp, new Date((exp)))
  if (currentTime > (exp * 1000)) {
    return 'expired'
  }
}

function checkIDPAndISS(idp, iss) {
  if (
    idp !== config.authProviderDetails.idp &&
    iss !== config.authProviderDetails.iss
  ) {
    return 'iss and or idp incorrect'
  }
}

// Check email domain
const checkEmailIsValid = (email, lists) => {
  const allowedDomains = lists.domains
  const allowedEmails = lists.emails
  const emailDomain = email.split(/@/)[1]
  // Check email or domain is clear listed
  if (
      allowedDomains[emailDomain]
    ||
      allowedEmails[email]
  ) {
    return
  }
  return 'email not allowed'
}

module.exports = {
  tokenIsValid: jwt => {
    let authErrors = { errors: []}

    if (jwt === 'default') {
      authErrors.errors.push('not a real token')
      return authErrors
    }

    const decodedToken = decode(jwt)
    const {email, idp, exp, iss} = decodedToken
    authErrors.errors = [
      checkExpired(exp),
      checkIDPAndISS(idp, iss),
      checkEmailIsValid(email, config.clearLists)
    ].filter(e => { return e })

    if (authErrors.errors.length > 0) {
      return authErrors
    }
    return {
      email: decodedToken.email
    }
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
  saveUserMap: (email, map) => {
    return new Promise((resolve, reject) => {
      jsonfile.writeFile(`./public/users/${email}/` +
        'config.json', map, (err) => {
        if (err) {
          return reject(err)
        }
          resolve(true)
      });
    })
  },
  checkEmailIsValid
};
