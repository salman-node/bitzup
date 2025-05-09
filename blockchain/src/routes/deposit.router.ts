import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/authentication';
import {
 depositHistory, depositWebhook

} from '../controller/deposit.controller';


router.get('/deposit-history', [verifyUser], depositHistory);

router.post('/deposit-webhook', depositWebhook);

export { router as depositRouter };

