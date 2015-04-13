'use strict';

var express = require('express');
var controller = require('./employee.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.put('/:id/:state/:time', controller.update);
router.get('/:id', controller.get);

module.exports = router;