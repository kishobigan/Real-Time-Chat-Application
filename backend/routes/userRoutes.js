const express = require('express');
const { registerUser, test, isEmailTaken, isUsernameTaken, login, token_authentication } = require('../controllers/userControllers');

const router = express.Router();

router.route('/test').get(test);
router.route('/emailTaken').post(isEmailTaken)
router.route('/usernameTaken').post(isUsernameTaken)
router.route('/register').post(registerUser);
router.route('/login').post(login)
router.route('/token_auth').post(token_authentication)

module.exports = router;
