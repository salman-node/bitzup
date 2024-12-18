"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var router = express_1.default.Router();
exports.userRouter = router;
var user_controller_1 = require("../controller/user.controller");
var authentication_1 = require("../middleware/authentication");
var otp_controller_1 = require("../controller/otp.controller");
router.post('/signup', user_controller_1.signUp);
router.post('/login', user_controller_1.logIn); // add new paramateres to doc
router.route('/verify-auth').post([authentication_1.verifyUser], user_controller_1.verifyAuth); // add to doc   need to remove
router.route('/verify-otp-auth').post([authentication_1.verifyUser], user_controller_1.verifyOtpAuth); // add to doc
router.route('/get-2fa').post([authentication_1.verifyUser], user_controller_1.get2FaAuth); // add to doc
router.route('/delete-2fa').post([authentication_1.verifyUser], user_controller_1.delete2FaAuth); // add to doc
router.route('/generate-2fa-key').post([authentication_1.verifyUser], user_controller_1.generate2FaKey); // add to doc
router.route('/change-password').post([authentication_1.verifyUser], user_controller_1.changePassword); //add to doc
router.post('/forgot-password', user_controller_1.forgotPass);
router.get('/get-all-countries', user_controller_1.getAllCountries);
router.route('/send-otp').post(otp_controller_1.sendOTP);
router.route('/verify-otp').post([authentication_1.verifyUser], otp_controller_1.verifyOTP);
