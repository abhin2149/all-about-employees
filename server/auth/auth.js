var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var Employee = require('../api/employee/employeeModel');

exports.decodeToken = function() {
  return function(req, res, next) {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  };
};

exports.getFreshEmployee = function() {
  return function(req, res, next) {
    Employee.findById(req.user._id)
      .then(function(employee) {
        if (!employee) {
          // if no employee is found it was not
          // it was a valid JWT but didn't decode
          // to a real employee in our DB. Either the employee was deleted
          // since the client got the JWT, or
          // it was a JWT from some other source
          res.status(401).send('Unauthorized');
        } else {
          // update req.employee with fresh employee from
          // stale token data
          req.employee = employee;
          next();
        }
      }, function(err) {
        next(err);
      });
  }
};

exports.verifyEmployee = function() {
  return function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // if no username or password then send
    if (!username || !password) {
      res.status(400).send('You need a username and password');
      return;
    }

    // look employee up in the DB so we can check
    // if the passwords match for the username
    Employee.findOne({username: username})
      .then(function(employee) {
        if (!employee) {
          res.status(401).send('No employee with the given username');
        } else {
          // checking the passowords here
          if (!employee.authenticate(password)) {
            res.status(401).send('Wrong password');
          } else {
            // if everything is good,
            // then attach to req.employee
            // and call next so the controller
            // can sign a token from the req.employee._id
            req.employee = employee;
            next();
          }
        }
      }, function(err) {
        next(err);
      });
  };
};

// util method to sign tokens on signup
exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    config.secrets.jwt,
    {expiresInMinutes: config.expireTime}
  );
};
