let express = require('express');

let ForgotOrResetPasswordController = require('../controllers/resetpassword');

let router = express.Router();

router.use('/forgotpassword',  ForgotOrResetPasswordController.forgotPassword);

module.exports = router ;