"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.withdrawalRouter = router;
const authentication_1 = require("../middleware/authentication");
const withdrawal_controller_1 = require("../controller/withdrawal.controller");
router.post('/request-withdraw', [authentication_1.verifyUser], withdrawal_controller_1.withdrawFunds);
router.get('/withdrawal-history', [authentication_1.verifyUser], withdrawal_controller_1.withdrawalHistory);
router.route('/generate-withdrawal-password').post([authentication_1.verifyUser], withdrawal_controller_1.generateWithdrawalPassword);
//# sourceMappingURL=withdrawal.router.js.map