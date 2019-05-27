const fs = require('fs');
const util = require('util');
const config = require('../config')
const mkdir = util.promisify(fs.mkdir);
const jsonfile = require('jsonfile');
const path = require('../config').default_path;
const has_creds = require('../azure/config').azure.topojson.key1.match(/\d/)
const decode = require('jwt-decode')
const blobFetcher = require('../azure/blob-fetcher');
const mapSavedMessage = 'This map will be retrieved next time you log in.'

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

function checkExpired(exp) {
  // Check token expiration
  const currentTime = new Date().getTime();
  console.log(new Date(currentTime), exp, new Date((exp)))
  if (currentTime > (exp * 1000)) {
    return 'expired'
  }
}

function checkISS(iss) {
  if (
    iss !== config.authProviderDetails.iss
  ) {
    return 'iss incorrect'
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

    if (jwt.match('default')) {
      authErrors.errors.push('not a real token')
      return authErrors
    }

    const decodedToken = decode(jwt)
    const {exp, iss} = decodedToken
    const email = decodedToken.email || decodedToken['signInNames.emailAddress']

    authErrors.errors = [
      checkExpired(exp),
      checkISS(iss),
      checkEmailIsValid(email, config.clearLists)
    ].filter(e => { return e })
    if (authErrors.errors.length > 0) {
      return authErrors
    }
    return {
      email
    }
  },

  checkUser: email => new Promise((resolve, reject) => {
    console.log(has_creds)
    if (has_creds) {
      blobFetcher.listBlobs('users')
      .then(ary => {
        // Look for user email in blob
        let target = `${email}/config.json`
        let match = ary.find(e => { return e === target })
        if (match) {
          // if match, then perhaps fetch and return blob
          // named by email
          blobFetcher.fetchBlob('users', target)
          .then(resolve)
          .catch(reject)
        } else {
          return resolve()
        }
      });
    } else {
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

    }
  }),

  saveUserMap: (email, map) => {
    return new Promise((resolve, reject) => {
      if (has_creds) {
        console.log('has creds!')
        blobFetcher.saveBlob('users', email, map)
        .then(msg => {
          resolve(`Saved to cloud! ${mapSavedMessage}`)
        }).catch(console.log)
      } else {
        jsonfile.writeFile(`./public/users/${email}/` +
          'config.json', map, (err) => {
          if (err) {
            return reject(err)
          }
            resolve(`Saved to local! ${mapSavedMessage}`)
        });
      }
    })
  },
  checkEmailIsValid
};
