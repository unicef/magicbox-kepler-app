//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const tokenInvalid = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NDM0NTcxNTUsImV4cCI6MTU3NDk5MzE1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJlbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.2cU__kIxuI-Lwm8lRcCa-nxFOARz4sNN71xgvN31OaE'
const defaultDate = 'Tue Sep 04 2018 16:02:04 GMT-0400 (Eastern Daylight Time)'
chai.use(chaiHttp);

describe('/GET Default map', () => {
    it('should GET default map when token is the word "default"', (done) => {
      chai.request(server)
          .get('/api/maps/default/default')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.info.unauthorized.should.be.equal(true);
                res.body.info.created_at.should.be.equal(defaultDate);
            done();
          });
    });

    it('should GET default map when token is invalid', (done) => {
      chai.request(server)
          .get('/api/maps/default/' + tokenInvalid)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.info.unauthorized.should.be.equal(true);
                res.body.info.created_at.should.be.equal(defaultDate);
            done();
          });
    });
});

describe('/Post User map', () => {
    it('should not save user map when token is invalid', (done) => {
      chai.request(server)
          .post('/api/maps/save/' + tokenInvalid)
          .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.message)
                res.body.message.should.be.contain("Error: you are not authorized to save a map");
                res.body.message.should.be.contain("email domain not whitelisted");
                res.body.message.should.be.contain("expired");
                // res.body.datasets[0].data.allData.lengthlength.should.be.eql(3);
            done();
          });
    });
});
