"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.userRouter = router;
const user_controller_1 = require("../controller/user.controller");
const authentication_1 = require("../middleware/authentication");
const otp_controller_1 = require("../controller/otp.controller");
router.post('/signup', user_controller_1.signUp);
router.post('/login', user_controller_1.logIn);
router.get('/getUserProfile', authentication_1.verifyUser, user_controller_1.getuserProfile);
router.get('/getUserActivity', authentication_1.verifyUser, user_controller_1.getUserActivity);
router.post('/logout', authentication_1.verifyUser, user_controller_1.logOut);
router.route('/verify-auth').post([authentication_1.verifyUser], user_controller_1.verifyAuth); // add to doc
router.route('/verify-otp-auth').post([authentication_1.verifyUser], user_controller_1.verifyOtpAuth); // add to doc
router.route('/get-2fa').post([authentication_1.verifyUser], user_controller_1.get2FaAuth); // add to doc
router.route('/delete-2fa').post([authentication_1.verifyUser], user_controller_1.delete2FaAuth); // add to doc
router.route('/generate-2fa-key').post([authentication_1.verifyUser], user_controller_1.generate2FaKey); // add to doc
router.route('/change-password').post([authentication_1.verifyUser], user_controller_1.changePassword); // add to doc
router.post('/forgot-password', user_controller_1.forgotPass);
router.post('/forget-password/verfiy', user_controller_1.VerifyForgetPassword);
router.get('/get-all-countries', user_controller_1.getAllCountries);
router.route('/send-otp').post(otp_controller_1.sendOTP);
router.route('/send-email-otp').post([authentication_1.verifyUser], otp_controller_1.sendEmailOtp);
//# sourceMappingURL=onboarding.routes.js.map