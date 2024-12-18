"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.adminRouter = router;
const controller_1 = require("../controller/controller");
router.route('/create-crypto-pair').post(controller_1.createCryptoPair);
//# sourceMappingURL=routes.js.map