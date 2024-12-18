import express from 'express';
const router = express.Router();
import {
    addFavorite,
    getFavorites,
    checkFavorite,
    getValidateCurrencies,
    getCurrencyList
} from '../controller/currency.controller';
import { verifyUser } from '../middleware/authentication';

router.route('/add-favorite').post([verifyUser], addFavorite);   // modify
router.route('/favorites').get([verifyUser], getFavorites);
router.route('/check-favorite').post([verifyUser], checkFavorite);
router.get('/favorites-validate-currencies', getValidateCurrencies);  // modify
router.get('/get-currencies', getCurrencyList);

export { router as currecyRouter };
