const express = require('express');
const router = express.Router();
const passport = require('passport');

const { accountController, circuitController } = require('../controllers');
const { shouldBeAuthenticated, shouldNotBeAuthenticated } = require('../middleware/authentication.middleware');

router.get('/', (req, res) => {
  res.send('Numeri API');
});

/**
 * ======================
 * Authentication
 * ======================
 */
router.get('/authenticated', accountController.checkAuthentication);

router.post('/login', passport.authenticate('local'), accountController.login);

router.post('/register', shouldNotBeAuthenticated, accountController.register);

router.post('/logout', accountController.logout);

router.post('/forgot-password', shouldNotBeAuthenticated, accountController.forgotPassword);

router.post('/reset-password/:userId/:token', shouldNotBeAuthenticated, accountController.resetPassword);

router.post('/circuit/claim',  shouldBeAuthenticated, circuitController.claimCircuit);


module.exports = router;
