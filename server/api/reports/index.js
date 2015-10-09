'use strict';

var express = require('express');
var controller = require('./reports.controller');

var router = express.Router();

router.get('/:year/:month', controller.createAll);
router.get('/:id/:year/:month', controller.create);

module.exports = router;