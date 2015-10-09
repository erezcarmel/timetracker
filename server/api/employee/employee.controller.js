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
var reqData = {};
var months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

// Get list of things
exports.index = function(req, res) {
    if (!req.params.month) {
        req.params.month = new Date().getMonth() + 1;
    }
    if (!req.params.year) {
        req.params.year = new Date().getFullYear();
    }
    fs.exists(localConfig.REPORTS_FOLDER + req.params.year + '/employees' + req.params.month + '.json', function (exists){
        if (!exists) {
            console.log(localConfig.REPORTS_FOLDER + req.params.year + '/employees' + req.params.month + '.json not exist!');
            return res.json(200, {});
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + + req.params.year + '/employees' + req.params.month + '.json', 'utf-8', function read(err, data) {
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
    reqData = {
        id: reqUrlArr[0],
        state: reqUrlArr[1],
        time: reqUrlArr[2]
    };

    fs.exists(localConfig.REPORTS_FOLDER + new Date().getFullYear() + '/employees' + (new Date().getMonth() + 1) + '.json', function (exists){
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
            fs.readFile(localConfig.REPORTS_FOLDER + new Date().getFullYear() + '/employees' + (new Date().getMonth() + 1) + '.json', 'utf-8', function read(err, data) {
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
    reqData = {
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
    reqData = {
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

function _isExists(data) {
    return employeesData[data.id] &&
        employeesData[data.id].data[new Date(parseInt(data.time)).getDate()] &&
        employeesData[data.id].data[new Date(parseInt(data.time)).getDate()][data.state];
}

function _isEmployeeExists(data) {
    return data.id in employees;
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
                    employeesData[id] = {
                        id: id,
                        data: {}
                    }
                }
                if (callback) {
                    callback();
                }
            });
        }
    });

}

function _addEmployee(data, callback) {
    employees[data.id] = {
        name: data.name,
        id: data.id
    };
    _writeJSON('employees', callback);
}

function _removeEmployee(data, callback) {
    delete employees[data.id];
    _writeJSON('employees', callback);
}

function _updateData(data, callback) {
    if (data.time) {
        var day = new Date(parseInt(data.time)).getDate();

        if (!employeesData[data.id]) {
            employeesData[data.id] = {
                id: data.id,
                data: {}
            };
        }
        if (!employeesData[data.id].data[day]) {
            employeesData[data.id].data[day] = {};
        }
        employeesData[data.id].data[day][data.state] = parseInt(data.time);

        if (employeesData[data.id].data[day].in && employeesData[data.id].data[day].out) {
            employeesData[data.id].data[day].total = employeesData[data.id].data[day].out - employeesData[data.id].data[day].in;
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