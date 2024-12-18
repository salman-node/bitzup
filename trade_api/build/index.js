"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var router_1 = __importDefault(require("./routes/router"));
var defaults_1 = __importDefault(require("./config/defaults"));
var app = (0, express_1["default"])();
dotenv_1["default"].config();
app.set('trust proxy', true);
app.use((0, cors_1["default"])());
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use('/user', router_1["default"]);
var port = defaults_1["default"].port;
app.listen(port, function () {
    console.log("server listening at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map