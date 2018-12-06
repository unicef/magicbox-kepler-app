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

function checkExpired(authErrors, exp) {
  // Check token expiration
  const currentTime = new Date().getTime();
  if ((currentTime*1000) > exp) {
    authErrors.errors.push('expired')
  }
  return authErrors
}

function checkIDPAndISS(authErrors, idp, iss) {
  if (
    idp !== config.authProviderDetails.idp &&
    iss !== config.authProviderDetails.iss
  ) {
    console.log(authErrors)
    authErrors.errors.push('iss and or idp incorrect')
  }
  return authErrors
}

// Check email domain
function checkEmailIsValid(authErrors, email, lists) {
  const whiteListedDomains = lists.domains
  const whiteListedEmails = lists.emails
  const emailDomain = email.split(/@/)[1]
  // Check email or domain is whitelisted
  if (
      whiteListedDomains[emailDomain]
    ||
      whiteListedEmails[email]
  ) {
    // If email isn't white white
    // then domain must be
    if (!whiteListedEmails[email]) {
      authErrors.errors.push('email domain not whitelisted')
    }
  } else {
    authErrors.errors.push('email domain not whitelisted')
  }
  return authErrors
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
    authErrors = checkExpired(authErrors,  exp)
    authErrors = checkIDPAndISS(authErrors, idp, iss)
    authErrors = checkEmailIsValid(authErrors, email, config.whiteLists)
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
  }
};
