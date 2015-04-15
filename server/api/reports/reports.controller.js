'use strict';

var _ = require('lodash');
var fs = require('fs');
var employeesData;
var logsPath = '/Users/erezcarmel/Desktop/';
var months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

exports.create = function(req, res) {
    loadData();
    createReport(req.url.substr(1));
};

exports.createAll = function(req, res) {
    loadData();
    createAll();
};

function loadData() {
    fs.exists(logsPath + 'employees' + (new Date().getMonth() + 1) + '.json', function (exists){
        if (!exists) {
            console.log('file not found!');
        } else {
            fs.readFile(logsPath + 'employees' + (new Date().getMonth() + 1) + '.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);
            });
        }
    });
}

function createReport(id) {
    console.log(employeesData[id]);
}

function createAll() {
    console.log(employeesData);
}