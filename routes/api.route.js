const express = require('express');
const router = express.Router();
const passport = require('passport');

const { accountController } = require('../controllers');
const { checkAuthentication } = require('../middleware/authentication.middleware');

router.get('/', (req, res) => {
  res.send('Numeri API');
});

/**
 * ======================
 * Authentication
 * ======================
 */
router.post('/checkit', accountController.checkAuthentication);

router.post('/login', passport.authenticate('local'), accountController.login);

router.post('/register', accountController.register);

router.post('/logout', accountController.logout);

router.post('/forgot-password', accountController.forgotPassword);

router.post('/reset-password/:userId/:token', accountController.resetPassword);


module.exports = router;
