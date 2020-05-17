const express = require('express');
const router = express.Router();

const { findVisit } = require('../middleware/visit.middleware');
const visitController = require('../controllers/visit.controller');
const { checkVisitAuthorization } = require('../middleware/user.middleware');

router.get('/', visitController.list);

router.get(
  '/:visitId',
  findVisit,
  checkVisitAuthorization,
  visitController.getVisit
);

module.exports = router;
