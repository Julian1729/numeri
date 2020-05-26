const express = require('express');
const router = express.Router();

const { findVisit, populateStats } = require('../middleware/visit.middleware');
const visitController = require('../controllers/visit.controller');
const { checkVisitAuthorization } = require('../middleware/user.middleware');

router.get('/', visitController.list);

router.get(
  '/:visitId',
  findVisit,
  checkVisitAuthorization,
  populateStats,
  visitController.getVisit
);

router.get(
  '/:visitId/stats',
  findVisit,
  checkVisitAuthorization,
  shouldBePopulated,
  visitController.getStats
);

router.get(
  '/:visitId/publishers',
  findVisit,
  checkVisitAuthorization,
  shouldBePopulated,
  visitController.findPublishers
);

module.exports = router;
