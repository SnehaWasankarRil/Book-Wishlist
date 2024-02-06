var chai = require('chai');
const chaiHttp = require('chai-http');

var server = require('../server');
const books = require('../models/wishlistModel');
const users = require('../models/userModel')
var should = chai.should();
 
chai.use(chaiHttp);


// Testcases for users
describe('users', function () {

  // register user
  it('should register the user on / POST', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        "username":"sneha2.wasankar",
        "email":"sneha2.wasankar@ril.com",
        "password":"sneha",
        "preferredGenre": "Fiction"
      })
      .end((err, res) => {
        res.should.have.status(201);
        console.log("Response Body for register user:", res.body);  
      });
      done();
  });

  // login user
  it('should login the user on / POST', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        "email":"sneha1.wasankar@ril.com",
        "password":"sneha"
      })
      .end((err, res) => {
        res.should.have.status(200);
        console.log("Response Body for login user:", res.body);  
      });
      done();
  });

  // get current user
  it('should fetch current user on / GET', (done) => {
  chai.request(server)
    .get('/api/users/current')
    .end((err, res) => {
      if (err) {
        console.error(err); // Log the error for debugging
      }
      res.should.have.status(200);
      console.log("Response Body for current user:",res.body); 
    });
    done();
  });
});



// Testcases for wishlist
describe('wishlist', function () {

  // get all books
  it('should fetch all books on / GET', (done) => {
    chai.request(server)
      .get('/api/wishlist')
      .end((err, res) => {
        res.should.have.status(200);
        console.log("Response Body for get all books:", res.body);
      });
      done();
  });

  // add one book
  it('should add a book on / POST', (done) => {
    chai.request(server)
      .post('/api/wishlist')
      .send({
        "bookTitle":"Book test",
        "bookDescription":"This is book test",
        "genre":"Horror",
        "completionStatus": "Completed"
      })
      .end((err, res) => {
        res.should.have.status(200);
        console.log("Response Body for add one book:", res.body);
        
      });
      done();
  });

  // get book by id
  it('should fetch one book on /{id} GET', (done) => {
    chai.request(server)
    .get('/api/wishlist/')
    .end(function(err, res) {
      chai.request(server)
      .get('/api/wishlist/' + res.body.data[0]._id)
      .end((err, res) =>{
        res.should.have.status(200);
        console.log("Response Body for fetch one book:" + res.body);
      });
    });
    done();
  });

  // update book by id
  it('should update one book on /{id} PUT', function (done) {
    chai.request(server)
      .get('/api/wishlist/')
      .end(function (err, res) {
        chai.request(server)
          .put('/api/wishlist/' + res.body.data[0]._id)
          .send({ 'bookTitle': 'updatedTestTitle' })
          .end(function (err, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object'); 
          });
      });
      done();
  });

  // delete book by id
  it('should delete one book on /{id} DELETE', function (done) {
    chai.request(server)
      .get('/api/wishlist/')
      .end(function (err, res) {
        chai.request(server)
          .delete('/api/wishlist/' + res.body.data[0]._id)
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object'); 
          });
      });
      done();
  });


});