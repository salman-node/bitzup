import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/authentication';
import {
 depositHistory

} from '../controller/deposit.controller';


router.get('/deposit-history', [verifyUser], depositHistory);


export { router as depositRouter };

