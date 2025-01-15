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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityLog = void 0;
// activityLog.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// const prisma = new PrismaClient();
function createActivityLog({ user_id, ip_address, activity_type, device_type, device_info, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activityLog = yield prisma.activity_logs.create({
                data: {
                    user_id,
                    ip_address,
                    activity_type,
                    device_type,
                    device_info
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
//# sourceMappingURL=activity.log.js.map