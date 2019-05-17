var Employee = require('../api/employee/employeeModel');
var signToken = require('./auth').signToken;

exports.signin = function(req, res, next) {
  // req.employee will be there from the middleware
  // verify employee. Then we can just create a token
  // and send it back for the client to consume
  var token = signToken(req.employee._id);
  res.json({token: token});
};
