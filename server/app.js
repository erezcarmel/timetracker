/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var fs = require('fs');
var config = require('./config/environment');
var localConfig = require('./config/local.env.js');
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

fs.exists(localConfig.REPORTS_FOLDER, function (exists){
    if (!exists) {
        fs.mkdir(localConfig.REPORTS_FOLDER, function() {
            console.log(localConfig.REPORTS_FOLDER + ' created');
        });
    }
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;