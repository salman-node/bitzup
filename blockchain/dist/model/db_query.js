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
exports.get_pair_data = exports.Create_Universal_Data = void 0;
const db_connections_1 = __importDefault(require("../config/db_connections"));
const Create_Universal_Data = function (database_table_name, obJdata) {
    return __awaiter(this, void 0, void 0, function* () {
        const abkey = Object.keys(obJdata);
        const abvalue = Object.values(obJdata);
        const sql = `INSERT INTO ${database_table_name} (${abkey}) VALUES (${abvalue.map(() => '?').join(',')})`;
        try {
            const result = yield db_connections_1.default.query(sql, abvalue);
            return result;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
};
exports.Create_Universal_Data = Create_Universal_Data;
const get_pair_data = function (pair_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT 
  cp.pair_id,
  cp.quantity_decimal AS qty_decimal,
  cp.price_decimal AS price_decimal,
  cp.trade_fee AS trade_fee,
  b1.current_balance AS base_asset_balance,
  b2.current_balance AS quote_asset_balance
FROM 
  crypto_pair cp
  LEFT JOIN balances b1 ON cp.base_asset_id COLLATE utf8mb4_general_ci = b1.currency_id COLLATE utf8mb4_general_ci AND b1.user_id = ?
  LEFT JOIN balances b2 ON cp.quote_asset_id COLLATE utf8mb4_general_ci = b2.currency_id COLLATE utf8mb4_general_ci AND b2.user_id = ?
WHERE 
  cp.pair_id = ?;`;
        try {
            const result = yield db_connections_1.default.promise().query(sql, [user_id, user_id, pair_id]);
            return result[0];
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
};
exports.get_pair_data = get_pair_data;
//# sourceMappingURL=db_query.js.map