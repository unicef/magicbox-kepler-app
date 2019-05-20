//Require the dev-dependencies
const chai = require('chai');
const clearLists = require('./config/config').clearLists
const chaiHttp = require('chai-http');
const helper = require('../helpers/helper-user-map');
const should = chai.should();
const authErrors = { errors: []}
describe('Approve allowed email domains and addresses', () => {
  helper.checkEmailIsValid('jdoe@unapproved.com', clearLists).should.equal('email not allowed')
  should.equal(helper.checkEmailIsValid('jdoe@approved.com', clearLists), undefined);
  should.equal(helper.checkEmailIsValid('jdoe@good.com', clearLists), undefined);
});
