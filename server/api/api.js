var router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/employees', require('./employee/employeeRoutes'));
router.use('/companies', require('./company/companyRoutes'));

module.exports = router;
