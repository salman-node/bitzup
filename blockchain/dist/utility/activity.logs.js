"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIplocation = exports.createActivityLog = void 0;
// activityLog.ts
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
// const prisma = new PrismaClient();
function createActivityLog({ user_id, ip_address, activity_type, device_type, device_info, location }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activityLog = yield prisma.activity_logs.create({
                data: {
                    user_id,
                    ip_address,
                    activity_type,
                    device_type,
                    device_info,
                    location
                }
            });
            return activityLog;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
exports.createActivityLog = createActivityLog;
function getIplocation(ip) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://ip-api.com/json/${ip}`);
            const data = response.data;
            if (data.status === 'success') {
                return `${data.city}, ${data.regionName}, ${data.country}`;
            }
            else {
                return 'Unknown';
            }
        }
        catch (err) {
            console.error('Failed to fetch location from IP:', err.message);
            return "Unknown";
        }
    });
}
exports.getIplocation = getIplocation;
//# sourceMappingURL=activity.logs.js.map