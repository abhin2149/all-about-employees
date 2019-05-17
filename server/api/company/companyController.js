var Company = require('./companyModel');
var Employee = require('../employee/employeeModel');
var _ = require('lodash');
var logger = require('../../util/logger');

exports.params = function (req, res, next, id) {
    Company.findById(id)
        .populate('owner','username')
        .populate('employees','username')
        .populate('past_employees','username')
        .select('-__v')
        .exec()
        .then(function (company) {
            if (!company) {
                next(new Error('No company with that id'));
            } else {
                req.company = company;
                next();
            }
        }, function (err) {
            next(err);
        });
};

exports.get = function (req, res, next) {
    Company.find({})
        .populate('owner','username')
        .populate('employees','username')
        .populate('past_employees','username')
        .select('-__v')
        .exec()
        .then(function (companies) {
            res.json(companies);
        }, function (err) {
            next(err);
        });
};

exports.getOne = function (req, res, next) {
    var company = req.company;
    res.json(company);
};

exports.put = function (req, res, next) {
    var company = req.company;

    var update = req.body;

    _.merge(company, update);

    company.save(function (err, saved) {
        if (err) {
            next(err);
        } else {
            res.json(saved);
        }
    });
};

exports.post = function (req, res, next) {
    var newcompany = req.body;
    var employee = req.employee;
    if(!employee.hasOwnProperty('company')) {
        newcompany.owner = req.employee._id;
        Company.create(newcompany)
            .then(function (company) {
                employee.company = company._id;
                employee.save(function (err, saved) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.json(company);
                    }
                })
            }, function (err) {
                logger.error(err);
                next(err);
            });
    }
    else{
        res.status(400).send('You cannot start more than one company');
    }

};

exports.delete = function (req, res, next) {
    req.company.remove(function (err, removed) {
        if (err) {
            next(err);
        } else {
            res.json(removed);
        }
    });
};

exports.join = function (req, res, next) {
    var company = req.company;
    var employee = req.employee;

    if(!employee.company) {
        company.employees.unshift(employee._id);
        company.save(function (err, saved) {
            if (err) {
                next(err);
            }
        });

        employee.company = company._id;
        employee.save(function (err, saved) {
            if (err) {
                next(err);
            }
            else {
                res.json(saved);
            }
        })
    }
    else{
        res.status(400).send('You cannot join more than one company');
    }
};

exports.leave = function (req,res,next){
    var company = req.company;
    var employee = req.employee;
    var duration=req.body.duration;
    var pos=-1;

    if(employee.company) {
        company.past_employees.unshift(employee._id);
        pos = _.findIndex(company.employees, {id: employee._id});
        company.employees.splice(pos, 1);
        company.save(function (err, saved) {
            if (err) {
                next(err);
            }
        });

        employee.company=undefined;
        employee.past_companies.unshift(company._id);
        employee.duration.unshift(duration);
        employee.save(function (err, saved) {
            if (err) {
                next(err);
            }
            else {
                res.json(saved);
            }
        })
    }
    else{
        res.status(400).send('You have not joined any company yet');
    }
};
