var router = require('express').Router();
var verifyEmployee = require('./auth').verifyEmployee;
var controller = require('./controller');

// before we send back a jwt, lets check
// the password and username match what is in the DB
router.post('/signin', verifyEmployee(), controller.signin);

module.exports = router;
