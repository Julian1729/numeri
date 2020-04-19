const express = require('express');
const router = express.Router();

const visitController = require('../controllers/visit.controller');

router.get('/', visitController.list);

module.exports = router;
