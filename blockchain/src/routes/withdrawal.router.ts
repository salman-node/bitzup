import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/authentication';
import {
 withdrawFunds,
 withdrawalHistory,
 generateWithdrawalPassword
} from '../controller/withdrawal.controller';



router.post('/request-withdraw', [verifyUser], withdrawFunds);
router.get('/withdrawal-history', [verifyUser], withdrawalHistory);
router.route('/generate-withdrawal-password').post([verifyUser], generateWithdrawalPassword);


export { router as withdrawalRouter };

