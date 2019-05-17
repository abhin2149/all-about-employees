var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./employeeController');
var auth = require('../../auth/auth');
var checkEmployee = [auth.decodeToken(), auth.getFreshEmployee()];

// setup boilerplate route jsut to satisfy a request
// for building
router.param('id', controller.params);
router.get('/me', checkEmployee, controller.me);

router.route('/')
  .get(controller.get)
  .post(controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(checkEmployee, controller.put)
  .delete(checkEmployee, controller.delete)

module.exports = router;
