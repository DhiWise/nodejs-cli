/**
 * index.js
 * @description :: index route of platforms
 */

const express = require('express');
const router =  express.Router();

router.use(require('./admin/index'));
router.use(require('./device/v1/index'));

module.exports = router;