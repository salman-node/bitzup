"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.depositRouter = router;
const authentication_1 = require("../middleware/authentication");
const deposit_controller_1 = require("../controller/deposit.controller");
router.get('/deposit-history', [authentication_1.verifyUser], deposit_controller_1.depositHistory);
//# sourceMappingURL=deposit.router.js.map