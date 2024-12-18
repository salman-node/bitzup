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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Update_Universal_Data = exports.Get_Where_Universal_Data = exports.Get_All_Universal_Data = exports.Create_Universal_Data = void 0;
var db_connection_1 = __importDefault(require("../config/db_connection"));
// module.exports.Create_Update_Sell_data_PRO = async (
//   user_id,
//   order_id,
//   pair_id,
//   pair_symbol,
//   base_asset_id,
//   quote_asset_id,
//   order_type_buy_sell,
//   order_type_market_limit,
//   quote_value_qty,
//   base_order_value,
//   at_price,
//   stop_limit_price,
//   order_placed_at
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         connectDB.rollback(function () {
//           throw err;
//         });
//       } else {
//         connectDB.query(
//           "update tbl_user_crypto_assets_balance_details set current_balance_btx=current_balance_btx-?,locked_balance_btx=locked_balance_btx+? , d_by=? where cuser_id_btx=? and asset_id_btx=?",
//           [base_order_value, base_order_value, user_id, user_id, base_asset_id],
//           function (err, result) {
//             if (err) {
//               connectDB.rollback(function () {
//                 throw err;
//               });
//             } else if (result.affectedRows != 0) {
//               connectDB.query(
//                 "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,pair_symbol_btx,asset_id_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,stop_limit_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   user_id,
//                   order_id,
//                   pair_id,
//                   pair_symbol,
//                   base_asset_id,
//                   quote_asset_id,
//                   quote_asset_id,
//                   order_type_buy_sell,
//                   order_type_market_limit,
//                   quote_value_qty,
//                   base_order_value,
//                   at_price,
//                   stop_limit_price,
//                   order_placed_at,
//                   user_id,
//                 ],
//                 function (err, result) {
//                   if (err) {
//                     connectDB.rollback(function () {
//                       throw err;
//                     });
//                   } else if (result.affectedRows != 0) {
//                     connectDB.commit();
//                     resolved(result);
//                   } else {
//                     connectDB.rollback();
//                     reject("No Data");
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.Create_Update_Buy_data_PRO = async (
//   user_id,
//   order_id,
//   pair_id,
//   pair_symbol,
//   base_asset_id,
//   quote_asset_id,
//   order_type_buy_sell,
//   order_type_market_limit,
//   quote_volume,
//   base_volume,
//   at_price,
//   stop_limit_price,
//   order_placed_at,
//   pair_type
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         throw err;
//       }
//       if (pair_type == "fiat_pair") {
//         connectDB.query(
//           "update tbl_user_fiat_wallet_master set current_balance_btx=current_balance_btx-?,locked_balance_btx=locked_balance_btx+?, d_by=? where cuser_id_btx=? and fiat_asset_id_btx=?",
//           [quote_volume, quote_volume, user_id, user_id, quote_asset_id],
//           function (err, result) {
//             if (err) {
//               connectDB.rollback(function () {
//                 throw err;
//               });
//             } else if (result.affectedRows != 0) {
//               connectDB.query(
//                 "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,pair_symbol_btx,asset_id_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,stop_limit_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   user_id,
//                   order_id,
//                   pair_id,
//                   pair_symbol,
//                   base_asset_id,
//                   quote_asset_id,
//                   quote_asset_id,
//                   order_type_buy_sell,
//                   order_type_market_limit,
//                   quote_volume,
//                   base_volume,
//                   at_price,
//                   stop_limit_price,
//                   order_placed_at,
//                   user_id,
//                 ],
//                 function (err, result) {
//                   if (err) {
//                     connectDB.rollback(function () {
//                       throw err;
//                     });
//                   } else if (result.affectedRows != 0) {
//                     connectDB.query(
//                       "SELECT COUNT(*) AS count FROM tbl_user_crypto_assets_balance_details WHERE cuser_id_btx =? and asset_id_btx=?",
//                       [user_id,base_asset_id],
//                       function (err, result) {
//                         if (err) {
//                           connectDB.rollback(function () {
//                             reject("err");
//                             throw err;
//                           });
//                         } 
//                         const rowCount = result[0].count;
//                         if(rowCount === 0){
//                           const insertQuery = 'INSERT INTO tbl_user_crypto_assets_balance_details (cuser_id_btx, asset_id_btx,c_by) VALUES (?, ?, ?)';
//                           const values = [user_id, base_asset_id, base_asset_id];
//                           connectDB.query(insertQuery, values, (error, results) => {
//                             if (error) {
//                               connectDB.rollback(function () {
//                                 reject("err");
//                                 throw err;})
//                             }else{
//                               connectDB.commit();
//                               resolved(result);
//                             }
//                           });
//                         }else{
//                              connectDB.commit();
//                               resolved(result);
//                         }
//                       }
//                     );
//                   } else {
//                     connectDB.rollback();
//                     reject("No Data");
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//       if (pair_type == "crypto_pair") {
//         console.log("okboss");
//         connectDB.query(
//           "update tbl_user_crypto_assets_balance_details set current_balance_btx=current_balance_btx-?,locked_balance_btx=locked_balance_btx+? ,d_by=? where cuser_id_btx=? and asset_id_btx=?",
//           [quote_volume, quote_volume, user_id, user_id, quote_asset_id],
//           function (err, result) {
//             if (err) {
//               connectDB.rollback(function () {
//                 throw err;
//               });
//             } else if (result.affectedRows != 0) {
//               console.log("q3");
//               connectDB.query(
//                 "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,pair_symbol_btx,asset_id_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,stop_limit_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                 [
//                   user_id,
//                   order_id,
//                   pair_id,
//                   pair_symbol,
//                   base_asset_id,
//                   quote_asset_id,
//                   quote_asset_id,
//                   order_type_buy_sell,
//                   order_type_market_limit,
//                   quote_volume,
//                   base_volume,
//                   at_price,
//                   stop_limit_price,
//                   order_placed_at,
//                   user_id,
//                 ],
//                 function (err, result) {
//                   if (err) {
//                     connectDB.rollback(function () {
//                       throw err;
//                     });
//                   } else if (result.affectedRows != 0) {
//                     connectDB.query(
//                       "SELECT COUNT(*) AS count FROM tbl_user_crypto_assets_balance_details WHERE cuser_id_btx =? and asset_id_btx=?",
//                       [user_id,base_asset_id],
//                       function (err, result) {
//                         if (err) {
//                           connectDB.rollback(function () {
//                             reject("err");
//                             throw err;
//                           });
//                         } 
//                         const rowCount = result[0].count;
//                         if(rowCount === 0){
//                           const insertQuery = 'INSERT INTO tbl_user_crypto_assets_balance_details (cuser_id_btx, asset_id_btx,c_by) VALUES (?, ?, ?)';
//                           const values = [user_id, base_asset_id, base_asset_id];
//                           connectDB.query(insertQuery, values, (error, results) => {
//                             if (error) {
//                               connectDB.rollback(function () {
//                                 reject("err");
//                                 throw err;})
//                             }else{
//                               connectDB.commit();
//                               resolved(result);
//                             }
//                           });
//                         }else{
//                              connectDB.commit();
//                               resolved(result);
//                         }
//                       }
//                     );
//                   } else {
//                     connectDB.rollback();
//                     reject("No Data");
//                   }
//                 }
//               );
//             }
//           }
//         );
//       } else {
//         console.log("cry");
//       }
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.Create_Update_quick_Buy_order_data = async (
//   pair_id,
//   pair_symbol,
//   quote_volume,
//   base_volume,
//   user_id,
//   quote_asset_id,
//   order_id,
//   base_asset_id,
//   order_type_buy_sell,
//   order_type_market_limit,
//   at_price,
//   order_placed_at
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         throw err;
//       }
//       connectDB.query(
//         "update tbl_user_fiat_wallet_master set locked_balance_btx=locked_balance_btx + ?,current_balance_btx=current_balance_btx-? where cuser_id_btx = ? and fiat_asset_id_btx=?",
//         [quote_volume, quote_volume, user_id, quote_asset_id],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               reject("err");
//             });
//           } else if (result.affectedRows != 0) {
//             connectDB.query(
//               "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,pair_symbol_btx,asset_id_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//               [
//                 user_id,
//                 order_id,
//                 pair_id,
//                 pair_symbol,
//                 base_asset_id,
//                 quote_asset_id,
//                 quote_asset_id,
//                 order_type_buy_sell,
//                 order_type_market_limit,
//                 quote_volume,
//                 base_volume,
//                 at_price,
//                 order_placed_at,
//                 user_id,
//               ],
//               function (err, result) {
//                 if (err) {
//                   connectDB.rollback(function () {
//                     reject("err");
//                     throw err;
//                   });
//                 } else if (result.affectedRows != 0) {
//                   connectDB.query(
//                     "SELECT COUNT(*) AS count FROM tbl_user_crypto_assets_balance_details WHERE cuser_id_btx =? and asset_id_btx=?",
//                     [user_id,base_asset_id],
//                     function (err, result) {
//                       if (err) {
//                         connectDB.rollback(function () {
//                           reject("err");
//                           throw err;
//                         });
//                       } 
//                       const rowCount = result[0].count;
//                       if(rowCount === 0){
//                         const insertQuery = 'INSERT INTO tbl_user_crypto_assets_balance_details (cuser_id_btx, asset_id_btx,c_by) VALUES (?, ?, ?)';
//                         const values = [user_id, base_asset_id, base_asset_id];
//                         connectDB.query(insertQuery, values, (error, results) => {
//                           if (error) {
//                             connectDB.rollback(function () {
//                               reject("err");
//                               throw err;})
//                           }else{
//                             connectDB.commit();
//                             resolved(result);
//                           }
//                         });
//                       }else{
//                            connectDB.commit();
//                             resolved(result);
//                       }
//                     }
//                   );
//                 } else {
//                   connectDB.rollback();
//                   reject("err");
//                 }
//               }
//             );
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.Create_Update_quick_Sell_order_data = async (
//   pair_id,
//   pair_symbol,
//   base_volume,
//   quote_volume,
//   user_id,
//   quote_asset_id,
//   order_id,
//   base_asset_id,
//   order_type_buy_sell,
//   order_type_market_limit,
//   at_price,
//   order_placed_at
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         throw err;
//       }
//       connectDB.query(
//         "update tbl_user_crypto_assets_balance_details set locked_balance_btx=locked_balance_btx + ?,current_balance_btx=current_balance_btx-? where cuser_id_btx = ? and asset_id_btx=?",
//         [base_volume, base_volume, user_id, base_asset_id],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               reject("err");
//             });
//           } else if (result.affectedRows != 0) {
//             connectDB.query(
//               "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,pair_symbol_btx,asset_id_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//               [
//                 user_id,
//                 order_id,
//                 pair_id,
//                 pair_symbol,
//                 base_asset_id,
//                 quote_asset_id,
//                 quote_asset_id,
//                 order_type_buy_sell,
//                 order_type_market_limit,
//                 quote_volume,
//                 base_volume,
//                 at_price,
//                 order_placed_at,
//                 user_id,
//               ],
//               function (err, result) {
//                 if (err) {
//                   connectDB.rollback(function () {
//                     reject("err");
//                     throw err;
//                   });
//                 } else if (result.affectedRows != 0) {
//                   connectDB.commit();
//                   resolved(result);
//                 } else {
//                   connectDB.rollback();
//                   reject("err");
//                 }
//               }
//             );
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.cancel_buy_order = async (
//   market_rate,
//   user_id,
//   order_id,
//   pair_id,
//   pair_symbol,
//   asset_pair,
//   quote_asset_id,
//   order_type,
//   order_type_market_limit,
//   base_order_value,
//   quote_order_value,
//   order_cancelled_at
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         reject("err");
//       }
//       connectDB.query(
//         "delete from tbl_user_open_order_history where cuser_id_btx = ? and order_id_btx= ?",
//         [user_id, order_id],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               reject("err");
//             });
//           } else {
//             if (result.affectedRows != 0) {
//               connectDB.query(
//                 "update tbl_user_fiat_wallet_master set locked_balance_btx=locked_balance_btx - ? , current_balance_btx=current_balance_btx+?,d_by=? where cuser_id_btx=? and fiat_asset_id_btx=?",
//                 [
//                   quote_order_value,
//                   quote_order_value,
//                   user_id,
//                   user_id,
//                   quote_asset_id,
//                 ],
//                 function (err, result) {
//                   if (err) {
//                     connectDB.rollback(function () {
//                       reject("err");
//                     });
//                   } else if (result.affectedRows != 0) {
//                     connectDB.query(
//                       "insert into tbl_user_cancelled_order_history (cuser_id_btx,order_id,base_asset_id_btx,quote_asset_id_btx,at_price,order_type_buy_sell,order_type_market_limit,base_order_value,quote_order_value,order_cancelled_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?)",
//                       [
//                         user_id,
//                         order_id,
//                         asset_pair,
//                         quote_asset_id,
//                         market_rate,
//                         order_type,
//                         order_type_market_limit,
//                         base_order_value,
//                         quote_order_value,
//                         order_cancelled_at,
//                         user_id,
//                       ],
//                       (err, res) => {
//                         if (err) {
//                           connectDB.rollback(() => {
//                             reject("err");
//                             throw err;
//                           });
//                         } else if (res.affectedRows != 0) {
//                           console.log("k1");
//                           connectDB.commit();
//                           resolved(result);
//                           // connectDB.end()
//                         } else {
//                           connectDB.rollback();
//                           reject("err");
//                         }
//                       }
//                     );
//                   } else {
//                     connectDB.query(
//                       "update tbl_user_crypto_assets_balance_details set locked_balance_btx=locked_balance_btx - ? , current_balance_btx=current_balance_btx+?,d_by=? where cuser_id_btx=? and asset_id_btx=?",
//                       [
//                         quote_order_value,
//                         quote_order_value,
//                         user_id,
//                         user_id,
//                         quote_asset_id,
//                       ],
//                       function (err, result) {
//                         if (err) {
//                           connectDB.rollback(function () {
//                             reject("err");
//                           });
//                         } else if (result.affectedRows != 0) {
//                           console.log("k1");
//                           connectDB.query(
//                             "insert into tbl_user_cancelled_order_history (cuser_id_btx,at_price,order_id,pair_symbol_btx,asset_id_btx,base_asset_id_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,base_order_value,quote_order_value,order_cancelled_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                             [
//                               user_id,
//                               at_price,
//                               order_id,
//                               pair_symbol,
//                               pair_id,
//                               asset_pair,
//                               quote_asset_id,
//                               order_type,
//                               order_type_market_limit,
//                               base_order_value,
//                               quote_order_value,
//                               order_cancelled_at,
//                               user_id,
//                             ],
//                             (err, res) => {
//                               if (err) {
//                                 connectDB.rollback(() => {
//                                   reject("err");
//                                   throw err;
//                                 });
//                               } else if (res.affectedRows != 0) {
//                                 console.log("k1");
//                                 connectDB.commit();
//                                 resolved(result);
//                                 // connectDB.end()
//                               } else {
//                                 connectDB.rollback();
//                                 reject("err");
//                               }
//                             }
//                           );
//                         } else {
//                           connectDB.rollback(function (err) {
//                             reject("err");
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             } else {
//               connectDB.rollback(function (err) {
//                 reject("err");
//               });
//             }
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.cancel_sell_order = async (
//   market_rate,
//   user_id,
//   order_id,
//   pair_id,
//   pair_symbol,
//   asset_pair,
//   currency,
//   order_type,
//   order_type_market_limit,
//   base_order_value,
//   quote_order_value,
//   order_cancelled_at
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         reject("err");
//       }
//       console.log(user_id, order_id);
//       connectDB.query(
//         "delete from tbl_user_open_order_history  WHERE cuser_id_btx = ? and order_id_btx=?",
//         [user_id, order_id],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               throw err;
//             });
//           } else if (result.affectedRows != 0) {
//             console.log(1);
//             connectDB.query(
//               "UPDATE tbl_user_crypto_assets_balance_details SET locked_balance_btx =  locked_balance_btx - ? ,current_balance_btx= current_balance_btx + ?,d_by=? WHERE cuser_id_btx = ? and asset_id_btx = ?",
//               [
//                 base_order_value,
//                 base_order_value,
//                 user_id,
//                 user_id,
//                 asset_pair,
//               ],
//               function (err, result) {
//                 if (err) {
//                   connectDB.rollback(function () {
//                     throw err;
//                   });
//                 } else if (result.changedRows != 0) {
//                   console.log(2);
//                   connectDB.query(
//                     "insert into tbl_user_cancelled_order_history (cuser_id_btx,order_id,pair_symbol_btx,asset_id_btx,base_asset_id_btx,quote_asset_id_btx,at_price,order_type_buy_sell,order_type_market_limit,base_order_value,quote_order_value,order_cancelled_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                     [
//                       user_id,
//                       order_id,
//                       pair_symbol,
//                       pair_id,
//                       asset_pair,
//                       currency,
//                       market_rate,
//                       order_type,
//                       order_type_market_limit,
//                       base_order_value,
//                       quote_order_value,
//                       order_cancelled_at,
//                       user_id,
//                     ],
//                     (err, res) => {
//                       if (err) {
//                         connectDB.rollback(() => {
//                           reject("err");
//                           throw err;
//                         });
//                       } else if (res.affectedRows != 0) {
//                         connectDB.commit();
//                         resolved(result);
//                         // connectDB.end()
//                       } else {
//                         console.log(3);
//                         connectDB.rollback();
//                         reject("err");
//                       }
//                     }
//                   );
//                 } else {
//                   console.log(4);
//                   connectDB.rollback();
//                   reject("err");
//                 }
//               }
//             );
//           } else {
//             console.log(result);
//             console.log(5);
//             connectDB.rollback(function () {
//               reject("err");
//             });
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// module.exports.Update_swap_data = async (
//   user_id,
//   order_id,
//   pair_id,
//   pair_symbol,
//   base_asset_id,
//   quote_asset_id,
//   order_type_buy_sell,
//   order_type_market_limit,
//   quote_asset_value,
//   base_asset_volume,
//   at_price,
//   order_placed_at
// ) => {
//   // Update user & admin crypto data 1) Debit base asset from user_tbl 2)Credit base asset to admin tbl  3)debit admin quote asset - swap fee
//   //    4) credit user quote asset  - swap fee   5) add swap fee details in swap_fee table 6)add swap trxn in tbl_swap_trxn_details
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         throw err;
//       }
//       connectDB.query(
//         "update tbl_user_crypto_assets_balance_details set main_balance_btx=main_balance_btx - ?,current_balance_btx=current_balance_btx - ?  where cuser_id_btx =? and asset_id_btx=?",
//         [quote_asset_value, quote_asset_value, user_id, quote_asset_id],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               throw err;
//             });
//           } else if (result.changedRows != 0) {
//             connectDB.query(
//               "insert into tbl_user_open_order_history (cuser_id_btx, order_id_btx,pair_id,asset_id_btx,pair_symbol_btx,quote_currency_btx,quote_asset_id_btx,order_type_buy_sell,order_type_market_limit,quote_order_value,base_order_value,at_price,order_placed_at,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//               [
//                 user_id,
//                 order_id,
//                 pair_id,
//                 base_asset_id,
//                 pair_symbol,
//                 quote_asset_id,
//                 quote_asset_id,
//                 order_type_buy_sell,
//                 order_type_market_limit,
//                 quote_asset_value,
//                 base_asset_volume,
//                 at_price,
//                 order_placed_at,
//                 user_id,
//               ],
//               function (err, result) {
//                 if (err) {
//                   connectDB.rollback(function () {
//                     throw err;
//                   });
//                 } else if (result.affectedRows != 0) {
//                   connectDB.query(
//                     "SELECT COUNT(*) AS count FROM tbl_user_crypto_assets_balance_details WHERE cuser_id_btx =? and asset_id_btx=?",
//                     [user_id,base_asset_id],
//                     function (err, result) {
//                       if (err) {
//                         connectDB.rollback(function () {
//                           reject("err");
//                           throw err;
//                         });
//                       } 
//                       const rowCount = result[0].count;
//                       if(rowCount === 0){
//                         const insertQuery = 'INSERT INTO tbl_user_crypto_assets_balance_details (cuser_id_btx, asset_id_btx,c_by) VALUES (?, ?, ?)';
//                         const values = [user_id, base_asset_id, base_asset_id];
//                         connectDB.query(insertQuery, values, (error, results) => {
//                           if (error) {
//                             connectDB.rollback(function () {
//                               reject("err");
//                               throw err;})
//                           }else{
//                             connectDB.commit();
//                             resolved(result);
//                           }
//                         });
//                       }else{
//                            connectDB.commit();
//                             resolved(result);
//                       }
//                     }
//                   );
//                 } else {
//                   connectDB.rollback();
//                   reject("err");
//                 }
//               }
//             );
//           } else {
//             connectDB.rollback();
//             reject();
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     return e;
//   });
// };
// const getLastEntryFromTableUniversal = async (table_name, column_name) => {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT (${column_name}) FROM ${table_name} WHERE id =(SELECT max(id) FROM ${table_name})`;
//     connectDB.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       resolved(result);
//     });
//   });
// };
// module.exports.getLastEntryFromTableUniversal = getLastEntryFromTableUniversal;
var Create_Universal_Data = function (database_table_name, obJdata) {
    return __awaiter(this, void 0, void 0, function () {
        var abkey, abvalue, sql, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abkey = Object.keys(obJdata);
                    abvalue = Object.values(obJdata);
                    sql = "INSERT INTO ".concat(database_table_name, " (").concat(abkey, ") VALUES (").concat(abvalue.map(function () { return '?'; }).join(','), ")");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_connection_1["default"].query(sql, abvalue)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Create_Universal_Data = Create_Universal_Data;
var Get_All_Universal_Data = function (data, database_table_name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var sql = "SELECT ".concat(data, " FROM ").concat(database_table_name, ";");
                        db_connection_1["default"].query(sql, function (err, result) {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.Get_All_Universal_Data = Get_All_Universal_Data;
var Get_Where_Universal_Data = function (data, database_table_name, filterquery) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var abkey = Object.keys(filterquery);
                        var abvalue = Object.values(filterquery);
                        var abkeydata = abkey.join("=? and ") + "=?";
                        var sql = "SELECT ".concat(data, " FROM ").concat(database_table_name, " WHERE ").concat(abkeydata);
                        db_connection_1["default"].query(sql, abvalue, function (err, result) {
                            if (err)
                                throw err;
                            resolve(result);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.Get_Where_Universal_Data = Get_Where_Universal_Data;
var Update_Universal_Data = function (database_table_name, updatedata, filterquery) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var abkey = Object.keys(updatedata);
                        var abvalue = Object.values(updatedata);
                        var abkeydata = abkey.join("= ? , ") + "= ? ";
                        var filterkey = Object.keys(filterquery);
                        var filtervalue = Object.values(filterquery);
                        var filterkeydata = filterkey.join("= ? AND ") + " = ?";
                        var result = Object.entries(filterquery);
                        var rdata = result.join(" and ");
                        var sdata = rdata.split(",");
                        var equaldata = sdata.join(" = ");
                        var values = __spreadArray(__spreadArray([], abvalue, true), filtervalue, true);
                        db_connection_1["default"].connect(function (err) {
                            if (err)
                                throw err;
                            var sql = "UPDATE ".concat(database_table_name, " SET ").concat(abkeydata, " WHERE ").concat(filterkeydata);
                            db_connection_1["default"].query(sql, values, function (err, result) {
                                if (err)
                                    throw err;
                                console.log(result.affectedRows + " record(s) updated");
                                resolve(result);
                            });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.Update_Universal_Data = Update_Universal_Data;
// module.exports.ASK_data = async (asset_id) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.query(
//       "select at_price,base_order_value,quote_order_value from tbl_user_open_order_history where order_type_buy_sell=? and asset_id_btx=? order by at_price asc limit 30",
//       ["SELL", asset_id],
//       (err, response) => {
//         if (err) throw err;
//         else resolved(response);
//       }
//     );
//   });
// };
// module.exports.BID_data = async (asset_id) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.query(
//       "select at_price,base_order_value,quote_order_value from tbl_user_open_order_history where order_type_buy_sell=? and asset_id_btx=? order by at_price desc limit 30",
//       ["BUY", asset_id],
//       (err, response) => {
//         if (err) throw err;
//         else resolved(response);
//       }
//     );
//   });
// };
// module.exports.Updated_offchain_withdrawal_data = async function (
//   receiver_User_id,
//   sender_user_id,
//   receiver_updated_asset_volume,
//   Receiver_new_avg_price,
//   asset_volume,
//   asset_id,
//   receiver_XID,
//   trxn_id,
//   remarks
// ) {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.beginTransaction(function (err) {
//       if (err) {
//         throw err;
//       }
//       // Receiver Balance and avg price Update
//       connectDB.query(
//         "UPDATE tbl_user_crypto_assets_balance_details SET main_balance_btx =main_balance_btx + ? ,current_balance_btx = ?,avg_buy_price=?, d_by=?,last_updated_at=? WHERE cuser_id_btx = ? and asset_id_btx = ?",
//         [
//           asset_volume,
//           receiver_updated_asset_volume,
//           Receiver_new_avg_price,
//           sender_user_id,
//           Date.now(),
//           receiver_User_id,
//           asset_id,
//         ],
//         function (err, result) {
//           if (err) {
//             connectDB.rollback(function () {
//               throw err;
//             });
//           } else {
//             if (result.changedRows != 0) {
//               // Update Sender Balance
//               connectDB.query(
//                 "update tbl_user_crypto_assets_balance_details set main_balance_btx =main_balance_btx - ? ,current_balance_btx =current_balance_btx - ?,d_by=?,last_updated_at=? where cuser_id_btx=? and asset_id_btx=?",
//                 [
//                   asset_volume,
//                   asset_volume,
//                   receiver_User_id,
//                   Date.now(),
//                   sender_user_id,
//                   asset_id,
//                 ],
//                 function (err, result) {
//                   if (err) {
//                     connectDB.rollback(function () {
//                       throw err;
//                     });
//                   } else if (result.changedRows != 0) {
//                     connectDB.query(
//                       "insert into tbl_user_crypto_withdrawal_trxn_details (cuser_id_btx,x_id_btx,wallet_id_btx,network,asset_id_btx,asset_amount_qty,to_address,remarks,trxn_id_btx,amount_recieved,trxn_fee,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?)",
//                       [
//                         sender_user_id,
//                         receiver_XID,
//                         "user_cyrpto_wallet",
//                         "Offchain",
//                         asset_id,
//                         asset_volume,
//                         receiver_XID,
//                         "offchain transferred ",
//                         trxn_id,
//                         "0",
//                         "0",
//                         receiver_User_id,
//                       ],
//                       (err, res) => {
//                         if (err) {
//                           connectDB.rollback(() => {
//                             reject("err");
//                             throw err;
//                           });
//                         } else if (res.affectedRows != 0) {
//                           connectDB.query(
//                             "insert into tbl_user_crypto_deposit_trxn_details (cuser_id_btx,x_id_btx,user_wallet_id_btx,network,asset_id_btx,amount_recieved,trxn_date_time,from_address,to_address,current_status,trxn_id_btx,remarks,c_by) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                             [
//                               receiver_User_id,
//                               receiver_XID,
//                               "user_cyrpto_wallet",
//                               "Offchain",
//                               asset_id,
//                               asset_volume,
//                               Date.now(),
//                               sender_user_id,
//                               receiver_XID,
//                               "1",
//                               trxn_id,
//                               remarks,
//                               sender_user_id,
//                             ],
//                             (err, res) => {
//                               if (err) {
//                                 connectDB.rollback(() => {
//                                   reject("err");
//                                   throw err;
//                                 });
//                               } else if (res.affectedRows != 0) {
//                                 connectDB.commit(() => {
//                                   resolved(res);
//                                 });
//                               }
//                             }
//                           );
//                         } else {
//                           connectDB.rollback();
//                           reject("err");
//                         }
//                       }
//                     );
//                   } else {
//                     connectDB.rollback();
//                     reject("err");
//                   }
//                 }
//               );
//             } else {
//               connectDB.rollback();
//               reject("err");
//             }
//           }
//         }
//       );
//     });
//   }).catch((e) => {
//     connectDB.rollback();
//     return e;
//   });
// };
// module.exports.Get_Where_Universal_Data_Specific = async function (
//   database_table_name,
//   filterquery,
//   fields
// ) {
//   return await new Promise((resolved, reject) => {
//     var abkey = Object.keys(filterquery);
//     var abvalue = Object.values(filterquery);
//     const abkeydata = abkey.join("= ? AND ") + "= ?";
//     var sql = `SELECT ${fields} FROM ${database_table_name} WHERE ${abkeydata}`;
//     connectDB.query(sql, abvalue, function (err, result) {
//       if (err) throw err;
//       // console.log(result);
//       resolved(result);
//     });
//   });
// };
// module.exports.get_last_executed_rate = async (asset_id) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.query(
//       "select at_rate from tbl_user_executed_order_history where pair_id=? order by id desc limit 1",
//       [asset_id],
//       (err, response) => {
//         if (err) throw err;
//         else resolved(response);
//       }
//     );
//   });
// };
// module.exports.Get_user_Open_orders_data = async function (user_id) {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_open_order_history.order_id_btx as order_id,
//     tbl_user_open_order_history.pair_id as pair_id,
//     tbl_user_open_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_open_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_open_order_history.order_type_market_limit as order_type,
//     tbl_user_open_order_history.quote_order_value as quote_volume,
//     tbl_user_open_order_history.base_order_value as base_volume,
//     tbl_user_open_order_history.at_price as at_rate,
//     tbl_user_open_order_history.stop_limit_price as stop_limit,
//     tbl_user_open_order_history.status as status,
//     tbl_user_open_order_history.order_placed_at as date_time,
//   asset_master_1.asset_icon_url AS asset_icon_url_1,
//   asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//   asset_master_1.asset_name_btx AS asset_name_btx_1,
//   asset_master_2.asset_icon_url AS asset_icon_url_2,
//   asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//   asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_open_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_open_order_history.asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_open_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_open_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_open_order_history.status=0 and tbl_user_open_order_history.cuser_id_btx=? `;
//     connectDB.query(sql, [user_id], function (err, result){
//       if (err) throw err;
//       // console.log(result);
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_all_Open_orders_data = async function () {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_open_order_history.order_id_btx as order_id,
//     tbl_user_open_order_history.pair_id as pair_id,
//     tbl_user_open_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_open_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_open_order_history.order_type_market_limit as order_type,
//     tbl_user_open_order_history.quote_order_value as quote_volume,
//     tbl_user_open_order_history.base_order_value as base_volume,
//     tbl_user_open_order_history.at_price as at_rate,
//     tbl_user_open_order_history.stop_limit_price as stop_limit,
//     tbl_user_open_order_history.status as status,
//     tbl_user_open_order_history.order_placed_at as date_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//   asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//   asset_master_1.asset_name_btx AS asset_name_btx_1,
//   asset_master_2.asset_icon_url AS asset_icon_url_2,
//   asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//   asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_open_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_open_order_history.asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_open_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_open_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_open_order_history.status=0`;
//     connectDB.query(sql, function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_asset_Open_orders_data = async function (asset_id) {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_open_order_history.order_id_btx as order_id,
//     tbl_user_open_order_history.pair_id as pair_id,
//     tbl_user_open_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_open_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_open_order_history.order_type_market_limit as order_type,
//     tbl_user_open_order_history.quote_order_value as quote_volume,
//     tbl_user_open_order_history.base_order_value as base_volume,
//     tbl_user_open_order_history.at_price as at_rate,
//     tbl_user_open_order_history.stop_limit_price as stop_limit,
//     tbl_user_open_order_history.status as status,
//     tbl_user_open_order_history.order_placed_at as date_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//   asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//   asset_master_1.asset_name_btx AS asset_name_btx_1,
//   asset_master_2.asset_icon_url AS asset_icon_url_2,
//   asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//   asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_open_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_open_order_history.asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_open_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_open_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_open_order_history.status=0 and tbl_user_open_order_history.asset_id_btx=?`;
//     connectDB.query(sql, [asset_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_user_asset_Open_orders_data = async function (
//   user_id,
//   asset_id
// ) {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_open_order_history.order_id_btx as order_id,
//     tbl_user_open_order_history.pair_id as pair_id,
//     tbl_user_open_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_open_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_open_order_history.order_type_market_limit as order_type,
//     tbl_user_open_order_history.quote_order_value as quote_volume,
//     tbl_user_open_order_history.base_order_value as base_volume,
//     tbl_user_open_order_history.at_price as at_rate,
//     tbl_user_open_order_history.stop_limit_price as stop_limit,
//     tbl_user_open_order_history.status as status,
//     tbl_user_open_order_history.order_placed_at as date_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//     asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//     asset_master_1.asset_name_btx AS asset_name_btx_1,
//     asset_master_2.asset_icon_url AS asset_icon_url_2,
//     asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//     asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_open_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_open_order_history.asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_open_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_open_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_open_order_history.status=0 and tbl_user_open_order_history.cuser_id_btx=? and tbl_user_open_order_history.asset_id_btx=?`;
//     connectDB.query(sql, [user_id, asset_id], function (err, result) {
//       if (err) reject(err);
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_All_Cancel_orders_data = async function () {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_cancelled_order_history.order_id ,
//     tbl_user_cancelled_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_cancelled_order_history.at_price as at_rate,
//     tbl_user_cancelled_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_cancelled_order_history.order_type_market_limit as order_type,
//     tbl_user_cancelled_order_history.base_order_value as base_volume,
//     tbl_user_cancelled_order_history.quote_order_value as quote_volume,
//     tbl_user_cancelled_order_history.order_cancelled_at as cancel_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//     asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//     asset_master_1.asset_name_btx AS asset_name_btx_1,
//     asset_master_2.asset_icon_url AS asset_icon_url_2,
//     asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//     asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_cancelled_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_cancelled_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_cancelled_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_cancelled_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx`;
//     connectDB.query(sql, function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_User_Cancel_orders_data = async function (user_id) {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_cancelled_order_history.order_id ,
//     tbl_user_cancelled_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_cancelled_order_history.at_price as at_rate,
//     tbl_user_cancelled_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_cancelled_order_history.order_type_market_limit as order_type,
//     tbl_user_cancelled_order_history.base_order_value as base_volume,
//     tbl_user_cancelled_order_history.quote_order_value as quote_volume,
//     tbl_user_cancelled_order_history.order_cancelled_at as cancel_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//     asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//     asset_master_1.asset_name_btx AS asset_name_btx_1,
//     asset_master_2.asset_icon_url AS asset_icon_url_2,
//     asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//     asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_cancelled_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_cancelled_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_cancelled_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_cancelled_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_cancelled_order_history.cuser_id_btx=?`;
//     connectDB.query(sql, [user_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_user_asset_Cancel_orders_data = async function (
//   user_id,
//   asset_id
// ) {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_cancelled_order_history.order_id ,
//     tbl_user_cancelled_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_cancelled_order_history.at_price as at_rate,
//     tbl_user_cancelled_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_cancelled_order_history.order_type_market_limit as order_type,
//     tbl_user_cancelled_order_history.base_order_value as base_volume,
//     tbl_user_cancelled_order_history.quote_order_value as quote_volume,
//     tbl_user_cancelled_order_history.order_cancelled_at as cancel_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//     asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//     asset_master_1.asset_name_btx AS asset_name_btx_1,
//     asset_master_2.asset_icon_url AS asset_icon_url_2,
//     asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//     asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_cancelled_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_cancelled_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_cancelled_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_cancelled_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_cancelled_order_history.cuser_id_btx=? and tbl_user_cancelled_order_history.asset_id_btx=?`;
//     connectDB.query(sql, [user_id, asset_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_asset_Cancel_orders_data = async function (asset_id) {
//   return await new Promise((resolved, reject) => {
//     var sql = `SELECT tbl_user_cancelled_order_history.order_id ,
//     tbl_user_cancelled_order_history.pair_symbol_btx as pair_symbol,
//     tbl_user_cancelled_order_history.at_price as at_rate,
//     tbl_user_cancelled_order_history.order_type_buy_sell as buy_sell,
//     tbl_user_cancelled_order_history.order_type_market_limit as order_type,
//     tbl_user_cancelled_order_history.base_order_value as base_volume,
//     tbl_user_cancelled_order_history.quote_order_value as quote_volume,
//     tbl_user_cancelled_order_history.order_cancelled_at as cancel_time,
//     asset_master_1.asset_icon_url AS asset_icon_url_1,
//     asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//     asset_master_1.asset_name_btx AS asset_name_btx_1,
//     asset_master_2.asset_icon_url AS asset_icon_url_2,
//     asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//     asset_master_2.asset_name_btx AS asset_name_btx_2,
//       tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//       FROM tbl_user_cancelled_order_history  
//       JOIN tbl_asset_master asset_master_1 ON tbl_user_cancelled_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//       JOIN tbl_asset_master asset_master_2 ON tbl_user_cancelled_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//       JOIN tbl_user_registration_master ON tbl_user_cancelled_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//       WHERE tbl_user_cancelled_order_history.asset_id_btx=?`;
//     connectDB.query(sql, [asset_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_All_Executed_orders = async function () {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_executed_order_history.*,
//    asset_master_1.asset_icon_url AS asset_icon_url_1,
//    asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//    asset_master_1.asset_name_btx AS asset_name_btx_1,
//    asset_master_2.asset_icon_url AS asset_icon_url_2,
//    asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//    asset_master_2.asset_name_btx AS asset_name_btx_2,
//      tbl_user_registration_master.cfirst_name_btx ,
//      tbl_user_registration_master.clast_name_btx,
//      tbl_user_registration_master.cemail_btx,
//      tbl_user_registration_master.x_id_btx
//      FROM tbl_user_executed_order_history  
//      JOIN tbl_asset_master asset_master_1 ON tbl_user_executed_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//      JOIN tbl_asset_master asset_master_2 ON tbl_user_executed_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//      JOIN tbl_user_registration_master ON tbl_user_executed_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx`;
//     connectDB.query(sql, function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_user_Executed_orders = async function (user_id) {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_executed_order_history.*,
//    asset_master_1.asset_icon_url AS asset_icon_url_1,
//    asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//    asset_master_1.asset_name_btx AS asset_name_btx_1,
//    asset_master_2.asset_icon_url AS asset_icon_url_2,
//    asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//    asset_master_2.asset_name_btx AS asset_name_btx_2,
//      tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//      FROM tbl_user_executed_order_history  
//      JOIN tbl_asset_master asset_master_1 ON tbl_user_executed_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//      JOIN tbl_asset_master asset_master_2 ON tbl_user_executed_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//      JOIN tbl_user_registration_master ON tbl_user_executed_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//      WHERE tbl_user_executed_order_history.cuser_id_btx=? `;
//     connectDB.query(sql, [user_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_user_asset_Executed_orders = async function (
//   user_id,
//   asset_id
// ) {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_executed_order_history.*,
//    asset_master_1.asset_icon_url AS asset_icon_url_1,
//    asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//    asset_master_1.asset_name_btx AS asset_name_btx_1,
//    asset_master_2.asset_icon_url AS asset_icon_url_2,
//    asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//    asset_master_2.asset_name_btx AS asset_name_btx_2,
//      tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//      FROM tbl_user_executed_order_history  
//      JOIN tbl_asset_master asset_master_1 ON tbl_user_executed_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//      JOIN tbl_asset_master asset_master_2 ON tbl_user_executed_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//      JOIN tbl_user_registration_master ON tbl_user_executed_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//      WHERE tbl_user_executed_order_history.cuser_id_btx=? and tbl_user_executed_order_history.base_asset_id_btx=?`;
//     connectDB.query(sql, [user_id, asset_id], function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_asset_Executed_orders = async function (asset_id) {
//   return await new Promise((resolved, reject) => {
//     const sql = `SELECT tbl_user_executed_order_history.*,
//    asset_master_1.asset_icon_url AS asset_icon_url_1,
//    asset_master_1.asset_symbol_btx AS asset_symbol_btx_1,
//    asset_master_1.asset_name_btx AS asset_name_btx_1,
//    asset_master_2.asset_icon_url AS asset_icon_url_2,
//    asset_master_2.asset_symbol_btx AS asset_symbol_btx_2,
//    asset_master_2.asset_name_btx AS asset_name_btx_2,
//      tbl_user_registration_master.cfirst_name_btx ,tbl_user_registration_master.clast_name_btx,tbl_user_registration_master.cemail_btx,tbl_user_registration_master.x_id_btx
//      FROM tbl_user_executed_order_history  
//      JOIN tbl_asset_master asset_master_1 ON tbl_user_executed_order_history.base_asset_id_btx = asset_master_1.asset_id_btx
//      JOIN tbl_asset_master asset_master_2 ON tbl_user_executed_order_history.quote_asset_id_btx = asset_master_2.asset_id_btx
//      JOIN tbl_user_registration_master ON tbl_user_executed_order_history.cuser_id_btx = tbl_user_registration_master.cuser_id_btx
//      WHERE tbl_user_executed_order_history.base_asset_id_btx=?`;
//     connectDB.query(sql, asset_id, function (err, result) {
//       if (err) throw err;
//       resolved(result);
//     });
//   });
// };
// module.exports.Get_Where_Universal_Data = async (database_table_name, data) => {
//   return await new Promise(async (resolved, reject) => {
//     const connection = await getConnection(connectDB.pool);
//     {
//       await select("*")
//         .from(database_table_name)
//         .where(keyData, operator, valueData)
//         .execute(connection)
//         .then(async (res) => {
//           resolved(res);
//         })
//         .catch(async (e) => {
//           throw e;
//         });
//     }
//   });
// };
// module.exports.Update_Universal_Data = async ( database_table_name,updatedata) => {
//    return await new Promise(async (resolved, reject) => {
//      connectDB.connection.query("UPDATE `${database_table_name}` SET `isdeleted` = '1' WHERE `order_id` = ?",[order_id],(err,res)=>{
//        if(err) throw err
//        resolved (res)
//      })
//     });
//    };
// module.exports.Create_Universal_Data = async (database_table_name, data) => {
//   return await new Promise(async (resolved, reject) => {
//     const connection = await getConnection(connectDB.pool);
//     {
//       await insert(database_table_name)
//         .given(data)
//         .execute(connection)
//         .then(async (res) => {
//           // await commit(connection)
//           resolved(res);
//         })
//         .catch(async (e) => {
//           throw e;
//         });
//     }
//   });
// };
// module.exports.Create_Universal_Data = async ( user_id,quote_value_qty, asset_name)=>{
// connectDB.pool.getConnection(function(err, connection) {
//   connection.beginTransaction(function(err) {
//       if (err) {
//           connection.rollback(function() {
//               connection.release();
//           });
//       } else {
//           connection.query("select * from tbl_user_fiat_wallet_master where user_id =?",[user_id], function(err, results) {
//               if (err) {
//                   connection.rollback(function() {
//                       connection.release();
//                   });
//               } else {
//                  console.log("results", results)
//                   connection.commit(function(err) {
//                       if (err) {
//                           connection.rollback(function() {
//                               connection.release();
//                               //Failure
//                           });
//                       } else {
//                           connection.release();
//                           //Success
//                       }
//                   });
//               }
//           });
//       }
//   });
// });
// }
// module.exports.Create_Universal_Data = async (
//   user_id,
//   quote_value_qty,
//   asset_name
// ) => {
//   return await new Promise(async (resolved, reject) => {
//     connectDB.pool.getConnection().then((promiseConnection) => {
//       var conn = promiseConnection.connection;
//       conn.beginTransaction((err) => {
//         return conn.query("select * from tbl_user_fiat_wallet_master where user_id =?",[user_id],(err, res) => {
//             if (err) throw err;
//             else {
//               const current_balance = res.map((a) => a.current_balance);
//               const locked_balance = res.map((a) => a.locked_balance);
//               console.log("c",current_balance)
//               console.log("q",quote_value_qty)
//         return conn.query("UPDATE tbl_user_fiat_wallet_master SET locked_balance = ? current_balance=? WHERE id = ?",
//               [
//                 current_balance,
//                 locked_balance,
//                 user_id,
//               ],
//               async (err, res) => {
//                 if (err) {
//                   await conn.rollback();
//                   throw err
//                 } else {
//                   resolved(res);
//                   await conn.commit();
//                 }
//               }
//             );
//               if (current_balance > quote_value_qty) {
//                 const user_updated_locked_balance = locked_balance + quote_value_qty;
//                   console.log('user_updated_locked_balance',user_updated_locked_balance)
//                 const user_updated_current_balance = current_balance - quote_value_qty;
//                   console.log("user_updated_current_balance",user_updated_current_balance)
//                   console.log("kk")
//               }else{
//               }
//             }
//           }
//         );
//       });
//     }).catch((e)=>{
//          return e
//     });
//   });
// };
// module.exports.Create_Universal_Data = async (user_id ) => {
//     await  connectDB.con.beginTransaction(function (err,response) {
//          if (err) {
//            throw err;
//          }
//          const query1 = "select current_balance from tbl_user_fiat_wallet_master where user_id =?"
//          const values1 = [user_id]
//         return connectDB.con.query(query1,values1, function (err, result) {
//            if (err) {
//              connectDB.rollback();
//              throw err
//            }else{
//               const data = result
//               console.log(data)
//               response (result)
//            }
//         });
//         //  connectDB.con.commit(function (err) {
//         //   if (err) {
//         //     connectDB.rollback(function () {
//         //       throw err;
//         //     });
//         //   }
//         //   console.log("success!");
//         // });
//        });
//    // });
//  };
// module.exports.Get_Where_Universal_Data = async (database_table_name, keyData ,operator,valueData) => {
//   return await new Promise(async (resolved, reject) => {
//     const connection = await getConnection(connectDB.pool);
//     {
//       await select("*")
//         .from(database_table_name)
//         .where(keyData ,operator,valueData)
//         .execute(connection).then((res)=>{
//          resolved(res)
//       })
//          .catch(async(e)=>{
//          await rollback(connection)
//           throw e
//          })
//     }
//   });
// };
// module.exports.Update_Universal_Data = async ( database_table_name,updatedata,keyData ,operator,valueData) => {
//    return await new Promise(async (resolved, reject) => {
//       const connection = await getConnection(connectDB.pool);
//       await startTransaction(connection);
//       {
//          await update(database_table_name)
//          .given(updatedata)
//          .where(keyData ,operator,valueData)
//          .execute(connection).then(async(res)=>{
//             resolved(res)
//          })
//          .catch(async(e)=>{
//             await rollback(connection)
//             throw e});
//       }
//     });
//    };
//    // module.exports.Create_Universal_Data = async (database_table_name2,updatedata2,keyData2 ,operator2,valueData2,database_table_name3,updatedata3,keyData3 ,operator3,valueData3,database_table_name1, data1,) => {
//    //    // return await new Promise(async (resolved, reject) => {
//    //      const connection = await getConnection(connectDB.pool);
//    //      await startTransaction(connection);
//    //    try{
//    //       await update(database_table_name2)
//    //           .given(updatedata2)
//    //           .where(keyData2 ,operator2,valueData2)
//    //           .execute(connection)
//    //       await update(database_table_name3)
//    //           .given(updatedata3)
//    //           .where(keyData3 ,operator3,valueData3)
//    //           .execute(connection)
//    //       await insert(database_table_name1)
//    //           .given(data1)
//    //           .execute(connection)
//    //       await commit(connection)
//    //    }catch(e){
//    //       await rollback(connection)
//    //        throw e
//    //    }
//    //    // });
//    //  };
// //"tbl_user_open_order_history"
// //{user_id: "U2000", asset_id: "12121", asset_name: "ETH-INR", status: "1"}
// module.exports.Get_Where_Universal_Data = async (database_table_name, data) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.dbConn.get_connection((qb) => {
//       qb.release();
//       qb.get_where(database_table_name, data, (err, response) => {
//         if (err) throw err;
//         resolved(response);
//       });
//     });
//   });
// };
// module.exports.Create_Universal_Data = async (database_table_name, data) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.dbConn.get_connection((qb) => {
//       qb.release();
//       qb.insert(database_table_name, data, (err, response) => {
//         if (err) throw err;
//         resolved(response);
//       });
//     });
//   });
// };
// module.exports.Update_Universal_Data = async (
//   database_table_name,
//   updatedata,
//   filter_by
// ) => {
//   return await new Promise((resolved, reject) => {
//     connectDB.dbConn.get_connection((qb) => {
//       qb.release();
//       qb.update(database_table_name, updatedata, filter_by, (err, response) => {
//         if (err) {
//           throw err;
//         }
//         resolved(response);
//       });
//     });
//   });
// };
// //  module.exports.Update_Universal_Data=async()=>{
// //     return await new Promise((resolved, reject) => {
// //        connectDB.query("UPDATE tbl_user_open_order_history SET asset_name = 'commit25' WHERE id = 27",(err,res)=>{
// //             if(err) throw err
// //            resolved(res)
// //        })
// //     })
// // }
// // //insert into `tbl_user_open_order_history` (user_id , asset_name ) values ('u0001' , 'btc')
// // module.exports.Update_Universal=async()=>{
//     return await new Promise((resolved, reject) => {
//         const Query = "INSERT INTO tbl_user_fiat_wallet_master (id ,user_id , wallet_id ,main_balance,locked_balance ,current_balance,currency,last_updated_on ,status,c_by ,c_date,d_by ) VALUES (id,'u00065', null ,null,null,null,null,null,null,null,null,null,null)"
//         connectDB.query(Query,(err,res)=>{
//             if(err) {throw err }
//             resolved(res)
//         })
//     })
// }
// *****************************************************************************
// const get_user_FiatData =await  new Promise((resolve, reject) => {
//    connectDB.query(query3,value3,function (err, result) {
//       if (err) throw err
//       resolve (result)
//    })
//  });
//  const locked_fund = get_user_FiatData.map(a=>a.locked_balance)
// // console.log(get_user_data)
// if(get_user_data){
// const get_admin_data = await  new Promise((resolve, reject) => {
//    connectDB.query(query4,value4,function (err, result) {
//       if (err) throw err
//       resolve (result)
//    })
//  });
// }
// connectDB.beginTransaction(async function (err) {
//   if (err) throw err;
//   var update_user = connectDB.query(query1, function (err, result) {
//     if (err) {
//       connectDB.rollback(function () {
//          throw err;
//        });
//     }
// });
//   if (update_user) {
//    var update_admin =  connectDB.query(query2, function (err, result) {
//       if (err) {
//         connectDB.rollback(function () {
//           throw err;
//         });
//       } else {
//         connectDB.commit(function (err) {
//           if (err) {
//             connectDB.rollback(function () {
//               throw err;
//             });
//           }
//           console.log("success!");
//         });
//       }
//     });
//   }
// });
// *****************************************************************************
// connectDB.beginTransaction(function(err) {
//    if (err) {
//        throw err;
//    }
//    connectDB.query(query1, function(err, result) {
//            if (err) {
//                connectDB.rollback(function() {
//                    throw err;
//                });
//            }else{
//                console.log('success!');                               //DONEEEEEEEEE
//            }
//            });
//    connectDB.query(query2, function(err, result) {
//            if (err) {
//                connectDB.rollback(function() {
//                    throw err;
//                });
//            }else{
//             connectDB.commit(function(err) {
//                if (err) {
//                  connectDB.rollback(function() {
//                    throw err;
//                  });
//                }
//                console.log('success!');
//              });
//            }
//            });
// });
//# sourceMappingURL=db_query.js.map