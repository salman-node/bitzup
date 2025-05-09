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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStatus = exports.validateCoordinate = exports.validateIp = exports.validateString = exports.validateNumber = exports.validateStringRequired = exports.validateNumberRequired = exports.validateNumberMinMaxRequired = exports.validateStringMinMax = exports.validateNumberMinMax = exports.validateStringMinMaxRequired = void 0;
const Joi = __importStar(require("joi"));
function validateStringMinMaxRequired(value, min, max) {
    const { error } = Joi.string().min(min).max(max).required().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateStringMinMaxRequired = validateStringMinMaxRequired;
function validateNumberMinMax(value, min, max) {
    const { error } = Joi.number().min(min).max(max).validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateNumberMinMax = validateNumberMinMax;
function validateStringMinMax(value, min, max) {
    const { error } = Joi.string().min(min).max(max).validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateStringMinMax = validateStringMinMax;
function validateNumberMinMaxRequired(value, min, max) {
    const { error } = Joi.number().min(min).max(max).required().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateNumberMinMaxRequired = validateNumberMinMaxRequired;
function validateNumberRequired(value) {
    const { error } = Joi.number().required().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateNumberRequired = validateNumberRequired;
function validateStringRequired(value) {
    const { error } = Joi.string().required().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateStringRequired = validateStringRequired;
function validateNumber(value) {
    const { error } = Joi.number().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateNumber = validateNumber;
function validateString(value) {
    const { error } = Joi.string().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateString = validateString;
function validateIp(value) {
    const { error } = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' }).required().validate(value);
    return error !== null && error !== void 0 ? error : null;
}
exports.validateIp = validateIp;
function validateCoordinate(value) {
    const { error } = Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
    }).required().validate(value);
    return error !== null && error !== void 0 ? error : null;
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
            throw new Error(`Unknown status: ${status}`);
    }
}
exports.checkStatus = checkStatus;
//export all functions
// export { validateString,}
//# sourceMappingURL=validation.js.map