import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/authentication';
import {
 withdrawFunds,
 withdrawalHistory
} from '../controller/withdrawal.controller';



router.post('/request-withdraw', [verifyUser], withdrawFunds);
router.get('/withdrawal-history', [verifyUser], withdrawalHistory);


export { router as withdrawalRouter };

