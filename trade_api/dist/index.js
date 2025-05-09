"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./routes/router"));
const defaults_1 = __importDefault(require("./config/defaults"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.set('trust proxy', true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', router_1.default);
const port = defaults_1.default.port;
app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map