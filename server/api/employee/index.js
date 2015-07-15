'use strict';

var express = require('express');
var controller = require('./employee.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/list', controller.list);
router.put('/:id/:state/:time', controller.update);
router.put('/add', controller.add);
router.put('/remove', controller.remove);
//router.put('/:id/:name', controller.add);
router.get('/:id', controller.get);

module.exports = router;