'use strict';

var express = require('express');
var controller = require('./reports.controller');

var router = express.Router();

router.get('/', controller.createAll);
router.get('/:id', controller.create);

module.exports = router;