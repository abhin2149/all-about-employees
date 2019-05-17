var Employee = require('./employeeModel');
var _ = require('lodash');
var signToken = require('../../auth/auth').signToken;

exports.params = function (req, res, next, id) {
    Employee.findById(id)
        .populate('company', 'name')
        .select('-password -__v')
        .exec()
        .then(function (employee) {
            if (!employee) {
                next(new Error('No employee with that id'));
            } else {
                req.employee = employee;
                next();
            }
        }, function (err) {
            next(err);
        });
};

exports.get = function (req, res, next) {
    Employee.find({})
        .populate('company', 'name')
        .select('-password -__v')
        .exec()
        .then(function (employees) {
            res.json(employees.map(function (employee) {
                return employee.toJson();
            }));
        }, function (err) {
            next(err);
        });
};

exports.getOne = function (req, res, next) {
    var employee = req.employee;
    res.json(employee.toJson());
};

exports.put = function (req, res, next) {
    var employee = req.employee;

    var update = req.body;

    _.merge(employee, update);

    employee.save(function (err, saved) {
        if (err) {
            next(err);
        } else {
            res.json(saved.toJson());
        }
    })
};

exports.post = function (req, res, next) {
    var newEmployee = new Employee(req.body);

    newEmployee.save(function (err, employee) {
        if (err) {
            return next(err);
        }

        var token = signToken(employee._id);
        res.json({token: token});
    });
};

exports.delete = function (req, res, next) {
    req.employee.remove(function (err, removed) {
        if (err) {
            next(err);
        } else {
            res.json(removed.toJson());
        }
    });
};

exports.me = function (req, res) {
    res.json(req.employee.toJson());
};
