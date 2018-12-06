//Require the dev-dependencies
const chai = require('chai');
const config = require('../config')
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const tokenInvalid = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyIsImtpZCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyJ9.eyJhdWQiOiJiMTRhNzUwNS05NmU5LTQ5MjctOTFlOC0wNjAxZDBmYzljYWEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkvIiwiaWF0IjoxNTM2Mjc1MTI0LCJuYmYiOjE1MzYyNzUxMjQsImV4cCI6MTUzNjI3OTAyNCwiYWlvIjoiQVhRQWkvOElBQUFBcXhzdUIrUjREMnJGUXFPRVRPNFlkWGJMRDlrWjh4ZlhhZGVBTTBRMk5rTlQ1aXpmZzN1d2JXU1hodVNTajZVVDVoeTJENldxQXBCNWpLQTZaZ1o5ay9TVTI3dVY5Y2V0WGZMT3RwTnR0Z2s1RGNCdGsrTExzdHovSmcrZ1lSbXY5YlVVNFhscGhUYzZDODZKbWoxRkN3PT0iLCJhbXIiOlsicnNhIl0sImVtYWlsIjoiYWJlbGlAbWljcm9zb2Z0LmNvbSIsImZhbWlseV9uYW1lIjoiTGluY29sbiIsImdpdmVuX25hbWUiOiJBYmUiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaXBhZGRyIjoiMTMxLjEwNy4yMjIuMjIiLCJuYW1lIjoiYWJlbGkiLCJub25jZSI6IjEyMzUyMyIsIm9pZCI6IjA1ODMzYjZiLWFhMWQtNDJkNC05ZWMwLTFiMmJiOTE5NDQzOCIsInJoIjoiSSIsInN1YiI6IjVfSjlyU3NzOC1qdnRfSWN1NnVlUk5MOHhYYjhMRjRGc2dfS29vQzJSSlEiLCJ0aWQiOiJmYTE1ZDY5Mi1lOWM3LTQ0NjAtYTc0My0yOWYyOTU2ZmQ0MjkiLCJ1bmlxdWVfbmFtZSI6IkFiZUxpQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJMeGVfNDZHcVRrT3BHU2ZUbG40RUFBIiwidmVyIjoiMS4wIn0=.UJQrCA6qn2bXq57qzGX_-D3HcPHqBMOKDPx4su1yKRLNErVD8xkxJLNLVRdASHqEcpyDctbdHccu6DPpkq5f0ibcaQFhejQNcABidJCTz0Bb2AbdUCTqAzdt9pdgQvMBnVH1xk3SCM6d4BbT4BkLLj10ZLasX7vRknaSjE_C5DI7Fg4WrZPwOhII1dB0HEZ_qpNaYXEiy-o94UJ94zCr07GgrqMsfYQqFR7kn-mn68AjvLcgwSfZvyR_yIK75S_K37vC3QryQ7cNoafDe9upql_6pB2ybMVlgWPs_DmbJ8g0om-sPlwyn74Cc1tW3ze-Xptw_2uVdPgWyqfuWAfq6Q'
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
