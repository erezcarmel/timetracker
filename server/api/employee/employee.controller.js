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

exports.update = function(req, res) {
    var reqUrlArr = req.url.substr(1).split('/');
    var reqData = {
        id: reqUrlArr[0],
        state: reqUrlArr[1],
        time: reqUrlArr[2]
    };

    fs.exists(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', function (exists){
        if (!exists) {
            _createJSON();
            _updateData(reqData, function() {
                console.log('JSON created');
            });
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);

                if (isExists(reqData)) {
                    res.json('exists');
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

function isExists(reqData) {
    return employeesData[reqData.id] &&
        employeesData[reqData.id].data[new Date(parseInt(reqData.time)).getDate()] &&
        employeesData[reqData.id].data[new Date(parseInt(reqData.time)).getDate()][reqData.state];
}

function _createJSON() {
    employeesData = {
        month: months[new Date().getMonth()]
    };
}

function _updateData(reqData, callback) {
    if (!employeesData[reqData.id]) {
        employeesData[reqData.id] = {
            id: reqData.id,
            data: {}
        };
    }
    var day = new Date(parseInt(reqData.time)).getDate();

    if (!employeesData[reqData.id].data[day]) {
        employeesData[reqData.id].data[day] = {};
    }
    employeesData[reqData.id].data[day][reqData.state] = parseInt(reqData.time);

    if (employeesData[reqData.id].data[day].in && employeesData[reqData.id].data[day].out) {
        employeesData[reqData.id].data[day].total = employeesData[reqData.id].data[day].out - employeesData[reqData.id].data[day].in;
    }

    _writeJSON(callback);
}

function _writeJSON(callback) {
    console.log('writing', JSON.stringify(employeesData));
    fs.writeFile(localConfig.REPORTS_FOLDER + 'employees' + (new Date().getMonth() + 1) + '.json', JSON.stringify(employeesData), function(err) {
        if (err) {
            callback(false);
        }
        callback(true);
    });
}