import express from 'express';
const router = express.Router();
import {
  signUp,
  logIn,
  verifyAuth,
  verifyOtpAuth,
  get2FaAuth,
  generate2FaKey,
  delete2FaAuth,
  changePassword,
  forgotPass,
  getAllCountries,
} from '../controller/user.controller';
import { verifyUser } from '../middleware/authentication';
import { sendEmailOtp, sendOTP,verifyOTP } from '../controller/otp.controller';

router.post('/signup', signUp);
router.post('/login', logIn);        // add new paramateres to doc
router.route('/verify-auth').post([verifyUser], verifyAuth);                    // add to doc   need to remove
router.route('/verify-otp-auth').post([verifyUser], verifyOtpAuth);         // add to doc
router.route('/get-2fa').post([verifyUser], get2FaAuth);                // add to doc
router.route('/delete-2fa').post([verifyUser], delete2FaAuth);          // add to doc
router.route('/generate-2fa-key').post([verifyUser], generate2FaKey);   // add to doc
router.route('/change-password').post([verifyUser],changePassword);                  //add to doc
router.post('/forgot-password', forgotPass);
router.get('/get-all-countries', getAllCountries);
router.route('/send-otp').post(sendOTP);
router.route('/send-email-otp').post([verifyUser],sendEmailOtp);
router.route('/verify-otp').post([verifyUser], verifyOTP);  

export { router as userRouter };
