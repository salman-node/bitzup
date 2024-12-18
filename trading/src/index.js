"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv = require("dotenv");
var defaults_1 = require("./config/defaults");
var routes_1 = require("./routes/onboarding.routes");
var app = (0, express_1.default)();
dotenv.config();
var PORT = defaults_1.default.port || process.env.PORT;
app.set('trust proxy', true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', routes_1.userRouter);
app.listen(PORT, function () {
    console.log("\u2699\uFE0F  BitzUp: server is running on port ".concat(defaults_1.default.BASE_URL));
});
