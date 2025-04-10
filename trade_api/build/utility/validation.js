"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.checkStatus = exports.validateCoordinate = exports.validateIp = exports.validateString = exports.validateNumber = exports.validateStringRequired = exports.validateNumberRequired = exports.validateNumberMinMaxRequired = exports.validateStringMinMax = exports.validateNumberMinMax = exports.validateStringMinMaxRequired = void 0;
var Joi = __importStar(require("joi"));
function validateStringMinMaxRequired(value, min, max) {
    var error = Joi.string().min(min).max(max).required().validate(value).error;
    return error;
}
exports.validateStringMinMaxRequired = validateStringMinMaxRequired;
function validateNumberMinMax(value, min, max) {
    var error = Joi.number().min(min).max(max).validate(value).error;
    return error;
}
exports.validateNumberMinMax = validateNumberMinMax;
function validateStringMinMax(value, min, max) {
    var error = Joi.string().min(min).max(max).validate(value).error;
    return error;
}
exports.validateStringMinMax = validateStringMinMax;
function validateNumberMinMaxRequired(value, min, max) {
    var error = Joi.number().min(min).max(max).required().validate(value).error;
    return error;
}
exports.validateNumberMinMaxRequired = validateNumberMinMaxRequired;
function validateNumberRequired(value) {
    var error = Joi.number().required().validate(value).error;
    return error;
}
exports.validateNumberRequired = validateNumberRequired;
function validateStringRequired(value) {
    var error = Joi.string().required().validate(value).error;
    return error;
}
exports.validateStringRequired = validateStringRequired;
function validateNumber(value) {
    var error = Joi.number().validate(value).error;
    return error;
}
exports.validateNumber = validateNumber;
function validateString(value) {
    var error = Joi.string().validate(value).error;
    return error;
}
exports.validateString = validateString;
function validateIp(value) {
    var error = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' }).required().validate(value).error;
    return error;
}
exports.validateIp = validateIp;
function validateCoordinate(value) {
    var error = Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
    }).required().validate(value).error;
    return error;
}
exports.validateCoordinate = validateCoordinate;
function checkStatus(status) {
    switch (status) {
        case 1:
            return 1;
        case 0:
            return 'Please complete your KYC (Know Your Customer) process to continue.';
        case 2:
            return 'Kindly provide your bank details to proceed.';
        case 3:
            return 'Your bank verification is currently pending and awaiting approval from our administrators.';
        case 5:
            return 'Your account has been blocked.';
        default:
            throw new Error("Unknown status: ".concat(status));
    }
}
exports.checkStatus = checkStatus;
//export all functions
// export { validateString,}
//# sourceMappingURL=validation.js.map