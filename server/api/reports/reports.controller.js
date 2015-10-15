'use strict';

var _ = require('lodash');
var fs = require('fs');
var excelbuilder = require('msexcel-builder');
var localConfig = require('../../config/local.env.js');

var employeesData;
var months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

exports.create = function(req, res) {
    loadData(req.params.year, req.params.month, function() {
        createReportsFolder(req.params.year, req.params.month, function() {
            createReport(req.params.id, req.params.year, req.params.month);
        });
    });
};

exports.createAll = function(req, res) {
    loadData(req.params.year, req.params.month, function() {
        createReportsFolder(req.params.year, req.params.month, function() {
            createAll(req.params.year, req.params.month);
        });
    });
};

function loadData(year, month, callback) {
    fs.exists(localConfig.REPORTS_FOLDER + year + '/employees' + month + '.json', function (exists){
        if (!exists) {
            console.log('file not found!');
        } else {
            fs.readFile(localConfig.REPORTS_FOLDER + year + '/employees' + month + '.json', 'utf-8', function read(err, data) {
                if (err) {
                    throw err;
                }
                employeesData = JSON.parse(data);
                callback();
            });
        }
    });
}

function createReport(id, year, month) {
    var workbook = excelbuilder.createWorkbook(localConfig.REPORTS_FOLDER + year + '/' + months[month - 1], id + '.xlsx');
    var sheet1 = workbook.createSheet(id, 4, 40);
    var row = 3;

    sheet1.width(4, 30);
    sheet1.width(3, 30);
    sheet1.width(2, 30);
    sheet1.width(1, 30);

    sheet1.merge({col:1, row:1}, {col:4, row:1});
    sheet1.align(1, 1, 'center');
    sheet1.font(1, 1, {sz:'24', family:'3', bold:'true', iter:'true'});
    var title = 'סיכום חודש ' + employeesData.month + ', ת.ז. ' + id;
    sheet1.set(1, 1, title);

    sheet1.font(4, 2, {sz:'18', family:'3', bold:'true', iter:'true'});
    sheet1.font(3, 2, {sz:'18', family:'3', bold:'true', iter:'true'});
    sheet1.font(2, 2, {sz:'18', family:'3', bold:'true', iter:'true'});
    sheet1.font(1, 2, {sz:'18', family:'3', bold:'true', iter:'true'});
    sheet1.align(4, 2, 'center');
    sheet1.align(3, 2, 'center');
    sheet1.align(2, 2, 'center');
    sheet1.align(1, 2, 'center');
    sheet1.set(4, 2, 'יום');
    sheet1.set(3, 2, 'כניסה');
    sheet1.set(2, 2, 'יציאה');
    sheet1.set(1, 2, 'סהכ');

    var weekdayCount = -1;
    var len = new Date(year, month, 0).getDate();
    for (var day = 1; day <= len; day++) {
        var inTime = employeesData[id].data[day] ? employeesData[id].data[day].in : false;
        var outTime = employeesData[id].data[day] ? employeesData[id].data[day].out : false;
        if (new Date(inTime).getDay() && weekdayCount === -1) {
            weekdayCount = new Date(inTime).getDay();
        }

        sheet1.align(1, row, 'center');
        sheet1.align(2, row, 'center');
        sheet1.align(3, row, 'center');
        sheet1.align(4, row, 'center');
        sheet1.font(1, row, {sz:'14', family:'3', bold:'true'});
        sheet1.font(2, row, {sz:'14', family:'3'});
        sheet1.font(3, row, {sz:'14', family:'3'});
        sheet1.font(4, row, {sz:'14', family:'3', bold:'true'});

        if (weekdayCount === 6) {
            sheet1.fill(1, row, {type:'solid', bgColor:'767676'});
            sheet1.fill(2, row, {type:'solid', bgColor:'767676'});
            sheet1.fill(3, row, {type:'solid', bgColor:'767676'});
            sheet1.fill(4, row, {type:'solid', bgColor:'767676'});
        }

        sheet1.set(4, row, day);
        if (inTime) {
            sheet1.set(3, row, getTime(inTime));
        }
        if (outTime) {
            sheet1.set(2, row, getTime(outTime));
        }
        if (inTime && outTime) {
            sheet1.set(1, row, getDayTotal(inTime, outTime));
        }
        row++;
        weekdayCount = weekdayCount < 6 ? weekdayCount + 1 : 0;
    }
    sheet1.align(1, row, 'center');
    sheet1.font(1, row, {sz:'18', family:'3', bold:'true'});
    sheet1.set(1, row, calcMonthTotal(employeesData[id].data));
    sheet1.font(2, row, {sz:'18', family:'3', bold:'true', iter:'true'});
    sheet1.set(2, row, 'סהכ');

    workbook.save(function(ok){
        if (!ok) {
            workbook.cancel();
        } else {
            console.log('workbook created');
        }
    });
}

function createAll(year, month) {
    for (var employee in employeesData) {
        if (employeesData[employee].data) {
            createReport(employee, year, month);
        }
    }
}

function getTime(timestamp) {
    var hours = new Date(parseInt(timestamp)).getHours();
    var minutes = new Date(parseInt(timestamp)).getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return  hours + ':' + minutes;
}

function getDayTotal(timeIn, timeOut) {
    var startDate = new Date(timeIn);
    var endDate = new Date(timeOut);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    if (endDate - startDate < 60000) {
        hours = minutes = 0;
    }

    if (hours < 0) {
        hours = hours + 24;
    }

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

function calcMonthTotal(data) {
    var monthTotal = 0;
    if (data) {
        for (var day in data) {
            monthTotal += typeof(data[day].total) !== 'undefined' ? data[day].total : 0;
        }
    }
    var minutes = parseInt(monthTotal / (1000*60)%60);
    var hours = parseInt(monthTotal / (1000*60*60));

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return hours + ':' + minutes;
}

function createReportsFolder(year, month, callback) {
    fs.exists(localConfig.REPORTS_FOLDER + year + '/' + months[month - 1], function (exists){
        if (!exists) {
            fs.mkdir(localConfig.REPORTS_FOLDER + year + '/' + months[month - 1], function(err, res) {
                callback()
            });
        } else {
            callback();
        }
    });
}