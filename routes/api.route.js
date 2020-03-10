const express = require('express');
const router = express.Router();
const passport = require('passport');

const { accountController } = require('../controllers');
const { checkAuthentication } = require('../middleware/authentication.middleware');

router.get('/', (req, res) => {
  res.send('Numeri API');
});

router.post('/checkit', checkAuthentication)

router.post('/login', passport.authenticate('local'), accountController.login);

router.post('/register', accountController.register)

// router.post('/reset-password', accountController.resetPassword)

module.exports = router;
