import express from 'express';
const router = express.Router()
import {
  createCryptoPair,
} from '../controller/controller';


router.route('/create-crypto-pair').post(createCryptoPair);



export { router as adminRouter };
