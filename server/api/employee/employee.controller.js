/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /employees              ->  index
 * POST    /employees              ->  create
 * GET     /employees/:id          ->  show
 * PUT     /employees/:id          ->  update
 * DELETE  /employees/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var fs = require('fs');
var localConfig = require('../../config/local.env.js');
var employees = {};
var employeesData;
var months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

// Get list of things
exports.index = function(req, res) {
    fs.exists(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', function (exists){
        if (!exists) {
            console.log(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json not exist!');
            _createJSON();
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);
                return res.json(200, employeesData);
            });
        }
    });
};

exports.list = function(req, res) {
    fs.exists(localConfig.REPORTS_FOLDER + 'employees.json', function (exists){
        if (!exists) {
            console.log(localConfig.REPORTS_FOLDER + 'employees.json not exist!');
            employees = {};
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employees = JSON.parse(data);
                return res.json(200, employees);
            });
        }
    });
};

exports.update = function(req, res) {
    var reqUrlArr = req.url.substr(1).split('/');
    var reqData = {
        id: reqUrlArr[0],
        state: reqUrlArr[1],
        time: reqUrlArr[2]
    };

    fs.exists(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', function (exists){
        if (!exists) {
            _createJSON(function() {
                if (!_isEmployeeExists(reqData)) {
                    res.json('notexists');
                } else {
                    _updateData(reqData, function() {
                        console.log('JSON created');
                    });
                }
            });
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);

                if (_isExists(reqData)) {
                    res.json('exists');
                } else if (!_isEmployeeExists(reqData)) {
                    res.json('notexists');
                } else {
                    _updateData(reqData, function(result) {
                        if (result) {
                            res.json('success');
                        }
                    });
                }
            });
        }
    });
};

exports.get = function(req, res) {
    return res.json(200, {
        data: employeesData[req.url.substr(1)],
        month: employeesData.month
    });
};

exports.add = function(req, res) {
    var reqData = {
        id: req.body.id,
        name: req.body.name
    };

    fs.exists(localConfig.REPORTS_FOLDER + 'employees.json', function (exists){
        if (!exists) {
            employees = {};

            _addEmployee(reqData, function(result) {
                if (result) {
                    res.json('success');
                }
            });

        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);

                if (_isEmployeeExists(reqData)) {
                    res.json('exists');
                } else {
                    _addEmployee(reqData, function(result) {
                        if (result) {
                            res.json('success');
                        }
                    });
                }
            });
        }
    });
};

exports.remove = function(req, res) {
    var reqData = {
        id: req.body.id
    };

    fs.exists(localConfig.REPORTS_FOLDER + 'employees.json', function (exists){
        if (exists) {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);

                if (_isEmployeeExists(reqData)) {
                    _removeEmployee(reqData, function(result) {
                        if (result) {
                            res.json('success');
                        }
                    });
                } else {
                    res.json('notexists');
                }
            });
        }
    });
};

function _isExists(reqData) {
    return employeesData[reqData.id] &&
        employeesData[reqData.id].data[new Date(parseInt(reqData.time)).getDate()] &&
        employeesData[reqData.id].data[new Date(parseInt(reqData.time)).getDate()][reqData.state];
}

function _isEmployeeExists(reqData) {
    return reqData.id in employees;
}

function _createJSON(callback) {
    fs.exists(localConfig.REPORTS_FOLDER + 'employees.json', function (exists){
        if (!exists) {
            console.log(localConfig.REPORTS_FOLDER + 'employees.json not exist!');
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employees = JSON.parse(data);
                employeesData = {
                    month: months[new Date().getMonth()]
                };
                for (var id in employees) {
                    console.log(id);
                    employeesData[id] = {
                        id: id,
                        data: {}
                    }
                }
                callback();
            });
        }
    });

}

function _addEmployee(reqData, callback) {
    employees[reqData.id] = {
        name: reqData.name,
        id: reqData.id
    };
    _writeJSON('employees', callback);
}

function _removeEmployee(reqData, callback) {
    delete employees[reqData.id];
    _writeJSON('employees', callback);
}

function _updateData(reqData, callback) {
    if (reqData.time) {
        var day = new Date(parseInt(reqData.time)).getDate();

        if (!employeesData[reqData.id]) {
            employeesData[reqData.id] = {
                id: employeesData[reqData.id],
                data: {}
            }
        }
        if (!employeesData[reqData.id].data[day]) {
            employeesData[reqData.id].data[day] = {};
        }
        employeesData[reqData.id].data[day][reqData.state] = parseInt(reqData.time);

        if (employeesData[reqData.id].data[day].in && employeesData[reqData.id].data[day].out) {
            employeesData[reqData.id].data[day].total = employeesData[reqData.id].data[day].out - employeesData[reqData.id].data[day].in;
        }
    }
    _writeJSON('employees' + (new Date().getMonth() + 1), callback);
}

function _writeJSON(id, callback) {
    console.log('writing', id);
    var dataToWrite = id === 'employees' ? employees : employeesData;
    fs.writeFile(localConfig.REPORTS_FOLDER + id + '.json', JSON.stringify(dataToWrite), 'utf-8', function(err) {
        if (err) {
            callback(false);
        }
        callback(true);
    });
}