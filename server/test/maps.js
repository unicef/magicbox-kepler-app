//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let tokenInvalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
let defaultDate = 'Tue Sep 04 2018 16:02:04 GMT-0400 (Eastern Daylight Time)'
chai.use(chaiHttp);

describe('/GET Default map', () => {
    it('should GET default map when token is the word "default"', (done) => {
      chai.request(server)
          .get('/api/maps/default/default')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.info.created_at.should.be.equal(defaultDate);
            done();
          });
    });

    it('should GET default map when token is invalid', (done) => {
      chai.request(server)
          .get('/api/maps/default/' + tokenInvalid)
          .end((err, res) => {
                res.should.have.status(200);
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
                res.body.message.should.be.equal("Error: you are not authorized to save a map");
                // res.body.datasets[0].data.allData.lengthlength.should.be.eql(3);
            done();
          });
    });
});
