var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./companyController');
var auth = require('../../auth/auth');

var checkEmployee = [auth.decodeToken(), auth.getFreshEmployee()];
// setup boilerplate route jsut to satisfy a request
// for building
router.param('id', controller.params);

router.route('/')
  .get(controller.get)
  .post(checkEmployee ,controller.post);

router.route('/:id')
  .get(controller.getOne)
  .put(checkEmployee, controller.put)
  .delete(checkEmployee, controller.delete);

router.route('/join/:id')
    .post(checkEmployee,controller.join);

router.route('/leave/:id')
    .post(checkEmployee,controller.leave);

module.exports = router;
