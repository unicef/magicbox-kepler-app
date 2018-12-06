//Require the dev-dependencies
const chai = require('chai');
const config = require('../config')
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const tokenInvalid = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NDM0NTcxNTUsImV4cCI6MTU3NDk5MzE1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.2cU__kIxuI-Lwm8lRcCa-nxFOARz4sNN71xgvN31OaE'
chai.use(chaiHttp);

describe('/GET token verification', () => {
    it('should return authorized false if token is invalid', (done) => {
      chai.request(server)
          .get('/api/maps/verify/' + tokenInvalid)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            res.should.have.status(200);
            res.body.authorized.should.be.equal(false);
            done();
          });
    });
});

describe('/GET Default map', () => {
    it('should GET error message when token is string "default"', (done) => {
      chai.request(server)
          .get('/api/maps/default/default')
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            res.should.have.status(200);
            res.body.error.should.be.equal('unauthorized');
            done();
          });
    });

    it('should GET error message when token is invalid', (done) => {
      chai.request(server)
          .get('/api/maps/default/' + tokenInvalid)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            res.should.have.status(200);
            res.body.error.should.be.equal('unauthorized');
            done();
          });
    });
});

describe('/Post User map', () => {
    it('should not save user map when token is invalid', (done) => {
      chai.request(server)
          .post('/api/maps/save/' + tokenInvalid)
          .end((err, res) => {
            if (err) {
              console.log(err)
            }
            res.should.have.status(200);
            if (config.saveable === true) {
              res.body.message.should.be.contain("Error: you are not authorized to save a map");
              res.body.message.should.be.contain("email not whitelisted");
              res.body.message.should.be.contain("expired");
            } else {
              res.body.message.should.be.contain("Error: you are not authorized to save a map");
            }
            done();
          });
    });
});
