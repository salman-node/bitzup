"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currecyRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.currecyRouter = router;
const currency_controller_1 = require("../controller/currency.controller");
const authentication_1 = require("../middleware/authentication");
router.route('/add-favorite').post([authentication_1.verifyUser], currency_controller_1.addFavorite); // modify
router.route('/favorites').get([authentication_1.verifyUser], currency_controller_1.getFavorites);
router.route('/check-favorite').post([authentication_1.verifyUser], currency_controller_1.checkFavorite);
router.get('/favorites-validate-currencies', currency_controller_1.getValidateCurrencies); // modify
router.get('/get-currencies', currency_controller_1.getCurrencyList);
//# sourceMappingURL=currency.routes.js.map