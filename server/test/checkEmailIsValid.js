//Require the dev-dependencies
const chai = require('chai');
const whiteLists = require('./config/config').whiteLists
const chaiHttp = require('chai-http');
const helper = require('../helpers/helper-user-map');
const should = chai.should();
const authErrors = { errors: []}
describe('Approve whitelisted email domains and addresses', () => {
  helper.checkEmailIsValid('jdoe@unapproved.com', whiteLists).should.equal('email not whitelisted')
  should.equal(helper.checkEmailIsValid('jdoe@approved.com', whiteLists), undefined);
  should.equal(helper.checkEmailIsValid('jdoe@good.com', whiteLists), undefined);
});
