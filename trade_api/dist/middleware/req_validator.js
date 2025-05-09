"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_cancel_order = exports.validate_sell_stop_limit = exports.validate_buy_stop_limit = exports.validate_sell_asset_pro = exports.validate_buy_asset_pro = void 0;
const validation_1 = require("../utility/validation");
const config_1 = require("../config/config");
const constants_1 = require("../utility/constants");
const responseFormat = (res, error, value) => {
    return res.status(config_1.config.HTTP_BAD_REQUEST).send({
        status_code: config_1.config.HTTP_BAD_REQUEST,
        status: 3,
        message: `${error.details[0].message} : ${value}`,
    });
};
// module.exports.validate_quick_buy = (req: any, res: any, next: any) => {
//   const { user_id, pair_id, quote_value_qty, ip, coordinate } = req.body;
//   const user_id_error =  validate_string_min_max_required(user_id, c.user_id_min, c.user_id_max);
//   if (user_id_error) {
//     return responseFormat(res, user_id_error, 'user_id');
//   }
//   const pair_id_error =  validate_string_min_max_required(pair_id, c.pair_id_min, c.pair_id_max);
//   if (pair_id_error) {
//     return responseFormat(res, pair_id_error, 'pair_id');
//   }
//   const quote_value_error =  validate_number_required(quote_value_qty);
//   if (quote_value_error) {
//     return responseFormat(res, quote_value_error, 'quote_value_qty');
//   }
//   const ip_error =  validate_ip(ip);
//   if (ip_error) {
//     return responseFormat(res, ip_error, 'ip');
//   }
//   const coordinate_error =  validate_coordinate(coordinate);
//   if (coordinate_error) {
//     return responseFormat(res, coordinate_error, 'coordinate');
//   }
//   next();
// };
const validate_buy_asset_pro = (req, res, next) => {
    const { user_id, pair_id, quote_volume, limit_price, order_type, ip_address, device_type, device_info } = req.body;
    const user_id_error = (0, validation_1.validateStringMinMaxRequired)(user_id, constants_1.c.userIdMin, constants_1.c.userIdMax);
    if (user_id_error) {
        return responseFormat(res, user_id_error, 'user_id');
    }
    const pair_id_error = (0, validation_1.validateStringMinMaxRequired)(pair_id, constants_1.c.pairIdMin, constants_1.c.pairIdMax);
    if (pair_id_error) {
        return responseFormat(res, pair_id_error, 'pair_id');
    }
    const quote_value_error = (0, validation_1.validateNumberRequired)(quote_volume);
    if (quote_value_error) {
        return responseFormat(res, quote_value_error, 'quote_volume');
    }
    const base_price_rate_error = (0, validation_1.validateNumberRequired)(limit_price);
    if (base_price_rate_error) {
        return responseFormat(res, base_price_rate_error, 'limit_price');
    }
    const order_type_error = (0, validation_1.validateStringRequired)(order_type);
    if (order_type_error) {
        console.log('order_type_error', order_type_error);
        return responseFormat(res, order_type_error, 'order_type');
    }
    const ip_address_error = (0, validation_1.validateIp)(ip_address);
    if (ip_address_error) {
        console.log('ip_address_error', ip_address_error);
        return responseFormat(res, ip_address_error, 'ip_address');
    }
    const device_type_error = (0, validation_1.validateStringRequired)(device_type);
    if (device_type_error) {
        console.log('device_type_error', device_type_error);
        return responseFormat(res, device_type_error, 'device_type');
    }
    const device_info_error = (0, validation_1.validateStringRequired)(device_info);
    if (device_info_error) {
        console.log('device_info_error', device_info_error);
        return responseFormat(res, device_info_error, 'device_info');
    }
    next();
};
exports.validate_buy_asset_pro = validate_buy_asset_pro;
const validate_sell_asset_pro = (req, res, next) => {
    const { user_id, pair_id, base_volume, limit_price, order_type, stop_limit_price, ip_address, device_type, device_info } = req.body;
    const user_id_error = (0, validation_1.validateStringMinMaxRequired)(user_id, constants_1.c.userIdMin, constants_1.c.userIdMax);
    if (user_id_error) {
        return responseFormat(res, user_id_error, 'user_id');
    }
    const pair_id_error = (0, validation_1.validateStringMinMaxRequired)(pair_id, constants_1.c.pairIdMin, constants_1.c.pairIdMax);
    if (pair_id_error) {
        return responseFormat(res, pair_id_error, 'pair_id');
    }
    const quote_value_error = (0, validation_1.validateNumberRequired)(base_volume);
    if (quote_value_error) {
        return responseFormat(res, quote_value_error, 'quote_volume');
    }
    const base_price_rate_error = (0, validation_1.validateNumberRequired)(limit_price);
    if (base_price_rate_error) {
        return responseFormat(res, base_price_rate_error, 'limit price');
    }
    const order_type_error = (0, validation_1.validateStringRequired)(order_type);
    if (order_type_error) {
        return responseFormat(res, order_type_error, 'order_type');
    }
    const stop_limit_price_error = (0, validation_1.validateNumber)(stop_limit_price);
    if (stop_limit_price_error) {
        return responseFormat(res, stop_limit_price_error, 'stop_limit_price');
    }
    const ip_address_error = (0, validation_1.validateIp)(ip_address);
    if (ip_address_error) {
        console.log('ip_address_error', ip_address_error);
        return responseFormat(res, ip_address_error, 'ip_address');
    }
    const device_type_error = (0, validation_1.validateStringRequired)(device_type);
    if (device_type_error) {
        console.log('device_type_error', device_type_error);
        return responseFormat(res, device_type_error, 'device_type');
    }
    const device_info_error = (0, validation_1.validateStringRequired)(device_info);
    if (device_info_error) {
        console.log('device_info_error', device_info_error);
        return responseFormat(res, device_info_error, 'device_info');
    }
    next();
};
exports.validate_sell_asset_pro = validate_sell_asset_pro;
const validate_buy_stop_limit = (req, res, next) => {
    const { user_id, pair_id, quote_volume, limit_price, stop_price, ip_address, device_type, device_info } = req.body;
    const user_id_error = (0, validation_1.validateStringMinMaxRequired)(user_id, constants_1.c.userIdMin, constants_1.c.userIdMax);
    if (user_id_error) {
        return responseFormat(res, user_id_error, 'user_id');
    }
    const pair_id_error = (0, validation_1.validateStringMinMaxRequired)(pair_id, constants_1.c.pairIdMin, constants_1.c.pairIdMax);
    if (pair_id_error) {
        return responseFormat(res, pair_id_error, 'pair_id');
    }
    const quote_value_error = (0, validation_1.validateNumberRequired)(quote_volume);
    if (quote_value_error) {
        return responseFormat(res, quote_value_error, 'quote_volume');
    }
    const base_price_rate_error = (0, validation_1.validateNumberRequired)(limit_price);
    if (base_price_rate_error) {
        return responseFormat(res, base_price_rate_error, 'limit_price');
    }
    const stop_limit_price_error = (0, validation_1.validateNumber)(stop_price);
    if (stop_limit_price_error) {
        return responseFormat(res, stop_limit_price_error, 'stop_limit_price');
    }
    const ip_address_error = (0, validation_1.validateIp)(ip_address);
    if (ip_address_error) {
        console.log('ip_address_error', ip_address_error);
        return responseFormat(res, ip_address_error, 'ip_address');
    }
    const device_type_error = (0, validation_1.validateStringRequired)(device_type);
    if (device_type_error) {
        console.log('device_type_error', device_type_error);
        return responseFormat(res, device_type_error, 'device_type');
    }
    const device_info_error = (0, validation_1.validateStringRequired)(device_info);
    if (device_info_error) {
        console.log('device_info_error', device_info_error);
        return responseFormat(res, device_info_error, 'device_info');
    }
    next();
};
exports.validate_buy_stop_limit = validate_buy_stop_limit;
const validate_sell_stop_limit = (req, res, next) => {
    const { user_id, pair_id, base_volume, limit_price, stop_price, ip_address, device_type, device_info } = req.body;
    const user_id_error = (0, validation_1.validateStringMinMaxRequired)(user_id, constants_1.c.userIdMin, constants_1.c.userIdMax);
    if (user_id_error) {
        return responseFormat(res, user_id_error, 'user_id');
    }
    const pair_id_error = (0, validation_1.validateStringMinMaxRequired)(pair_id, constants_1.c.pairIdMin, constants_1.c.pairIdMax);
    if (pair_id_error) {
        return responseFormat(res, pair_id_error, 'pair_id');
    }
    const quote_value_error = (0, validation_1.validateNumberRequired)(base_volume);
    if (quote_value_error) {
        return responseFormat(res, quote_value_error, 'base_volume');
    }
    const base_price_rate_error = (0, validation_1.validateNumberRequired)(limit_price);
    if (base_price_rate_error) {
        return responseFormat(res, base_price_rate_error, 'limit_price');
    }
    const stop_limit_price_error = (0, validation_1.validateNumber)(stop_price);
    if (stop_limit_price_error) {
        return responseFormat(res, stop_limit_price_error, 'stop_limit_price');
    }
    const ip_address_error = (0, validation_1.validateIp)(ip_address);
    if (ip_address_error) {
        console.log('ip_address_error', ip_address_error);
        return responseFormat(res, ip_address_error, 'ip_address');
    }
    const device_type_error = (0, validation_1.validateStringRequired)(device_type);
    if (device_type_error) {
        console.log('device_type_error', device_type_error);
        return responseFormat(res, device_type_error, 'device_type');
    }
    const device_info_error = (0, validation_1.validateStringRequired)(device_info);
    if (device_info_error) {
        console.log('device_info_error', device_info_error);
        return responseFormat(res, device_info_error, 'device_info');
    }
    next();
};
exports.validate_sell_stop_limit = validate_sell_stop_limit;
const validate_cancel_order = (req, res, next) => {
    const { user_id, order_id, pair_id, ip_address, device_type, device_info } = req.body;
    const user_id_error = (0, validation_1.validateStringMinMaxRequired)(user_id, constants_1.c.userIdMin, constants_1.c.userIdMax);
    if (user_id_error) {
        return responseFormat(res, user_id_error, 'user_id');
    }
    const pair_id_error = (0, validation_1.validateStringMinMaxRequired)(pair_id, constants_1.c.pairIdMin, constants_1.c.pairIdMax);
    if (pair_id_error) {
        return responseFormat(res, pair_id_error, 'pair_id');
    }
    const order_id_error = (0, validation_1.validateStringMinMaxRequired)(order_id, constants_1.c.orderIdMin, constants_1.c.orderIdMax);
    if (order_id_error) {
        console.log('order_id_error', order_id_error);
        return responseFormat(res, order_id_error, 'order_id');
    }
    const ip_address_error = (0, validation_1.validateIp)(ip_address);
    if (ip_address_error) {
        console.log('ip_address_error', ip_address_error);
        return responseFormat(res, ip_address_error, 'ip_address');
    }
    const device_type_error = (0, validation_1.validateStringRequired)(device_type);
    if (device_type_error) {
        console.log('device_type_error', device_type_error);
        return responseFormat(res, device_type_error, 'device_type');
    }
    const device_info_error = (0, validation_1.validateStringRequired)(device_info);
    if (device_info_error) {
        console.log('device_info_error', device_info_error);
        return responseFormat(res, device_info_error, 'device_info');
    }
    next();
};
exports.validate_cancel_order = validate_cancel_order;
// module.exports.validate_quick_sell=(req,res,next)=>{
//       const { user_id, pair_id, base_volume, ip, coordinate } = req.body;
//     const user_id_error =  validate_string_min_max_required(user_id,c.user_id_min,c.user_id_max)
//     if(user_id_error){
//        return response_format(res,user_id_error , 'user_id')
//     }
//     const pair_id_error =  validate_string_min_max_required(pair_id,c.pair_id_min,c.pair_id_max)
//     if(pair_id_error){
//        return response_format(res,pair_id_error,'pair_id')
//     }
//     const base_value_error =  validate_number_required(base_volume)
//     if(base_value_error){
//        return response_format(res,base_value_error,'base_volume')
//     }
//     const ip_error =  validate_ip(ip)
//     if(ip_error){
//        return response_format(res,ip_error , 'ip')
//     }
//     const coordinate_error =  validate_coordinate(coordinate)
//     if(coordinate_error){
//        return response_format(res,coordinate_error , 'coordinate')
//     }
//    next()
// }
// module.exports.validate_sell_asset_pro =(req,res,next)=>{
//    const { user_id,pair_id, base_volume, quote_price_rate,order_type,stop_limit_price,ip,coordinate } = req.body;
//     const user_id_error =  validate_string_min_max_required(user_id,c.user_id_min,c.user_id_max)
//     if(user_id_error){
//        return response_format(res,user_id_error , 'user_id')
//     }
//     const pair_id_error =  validate_string_min_max_required(pair_id,c.pair_id_min,c.pair_id_max)
//     if(pair_id_error){
//        return response_format(res,pair_id_error,'pair_id')
//     }
//     const base_volume_error =  validate_number_required(base_volume)
//     if(base_volume_error){
//        return response_format(res,base_volume_error,'base_volume')
//     }
//     const quote_price_rate_error =  validate_number_required(quote_price_rate)
//     if(quote_price_rate_error){
//        return response_format(res,quote_price_rate_error,'quote_price_rate')
//     }
//     const order_type_error =  validate_string_required(order_type)
//     if(order_type_error){
//        return response_format(res,order_type_error,'order_type')
//     }
//     const stop_limit_price_error =  validate_number(stop_limit_price)
//     if(stop_limit_price_error){
//        return response_format(res,stop_limit_price_error,'stop_limit_price')
//     }
//     const ip_error =  validate_ip(ip)
//     if(ip_error){
//        return response_format(res,ip_error , 'ip')
//     }
//     const coordinate_error =  validate_coordinate(coordinate)
//     if(coordinate_error){
//        return response_format(res,coordinate_error , 'coordinate')
//     }
//    next()
// }
// module.exports.validate_modify_order =(req,res,next)=>{
//    const {user_id,order_id, pair_id, base_volume,quote_price_rate, quote_volume,base_price_rate,order_type, stop_limit_price,ip,coordinate} = req.body;
//     const user_id_error =  validate_string_min_max_required(user_id,c.user_id_min,c.user_id_max)
//     if(user_id_error){
//        return response_format(res,user_id_error , 'user_id')
//     }
//     const order_id_error =  validate_string_min_max_required(order_id,c.order_id_min,c.order_id_max)
//     if(order_id_error){
//        return response_format(res,order_id_error,'order_id')
//     }
//     const pair_id_error =  validate_string_min_max_required(pair_id,c.pair_id_min,c.pair_id_max)
//     if(pair_id_error){
//        return response_format(res,pair_id_error,'pair_id')
//     }
//     const ip_error =  validate_ip(ip)
//     if(ip_error){
//        return response_format(res,ip_error , 'ip')
//     }
//     const coordinate_error =  validate_coordinate(coordinate)
//     if(coordinate_error){
//        return response_format(res,coordinate_error , 'coordinate')
//     }
//    next()
// }
// module.exports.validate_swap_order =(req,res,next)=>{
//    const { user_id, pair_id, quote_asset_volume, ip, coordinate } = req.body;
//     const user_id_error =  validate_string_min_max_required(user_id,c.user_id_min,c.user_id_max)
//     if(user_id_error){
//        return response_format(res,user_id_error , 'user_id')
//     }
//     const pair_id_error =  validate_string_min_max_required(pair_id,c.pair_id_min,c.pair_id_max)
//     if(pair_id_error){
//        return response_format(res,pair_id_error,'pair_id')
//     }
//     const quote_value_error =  validate_number_required(quote_asset_volume)
//     if(quote_value_error){
//        return response_format(res,quote_value_error,'quote_asset_volume')
//     }
//     const ip_error =  validate_ip(ip)
//     if(ip_error){
//        return response_format(res,ip_error , 'ip')
//     }
//     const coordinate_error =  validate_coordinate(coordinate)
//     if(coordinate_error){
//        return response_format(res,coordinate_error , 'coordinate')
//     }
//    next()
// }
// module.exports.validate_ask_data =(req,res,next)=>{
//    const { asset_id } = req.body;
//     const asset_id_error =  validate_string_min_max_required(asset_id,c.asset_id_min,c.asset_id_max)
//     if(asset_id_error){
//        return response_format(res,asset_id_error , 'asset_id')
//     }
//    next()
// }
// module.exports.validate_get_executed_orders =(req,res,next)=>{
//    const user_id = req.params.user_id;
//    const { User_id, asset_id } = req.body;
//    const user_id_error =  validate_string_min_max_required(user_id,c.user_id_min,c.user_id_max)
//    if(user_id_error){
//       return response_format(res,user_id_error , 'user_id params')
//    }
//    const User_id_error =  validate_string_min_max(User_id,c.user_id_min,c.user_id_max)
//    if(User_id_error){
//       return response_format(res,User_id_error, 'user_id')
//    }
//     const asset_id_error =  validate_string_min_max(asset_id,c.asset_id_min,c.asset_id_max)
//     if(asset_id_error){
//        return response_format(res,asset_id_error , 'asset_id')
//     }
//    next()
// }
// module.exports.validate_pair_id =(req,res,next)=>{
//    const {pair_id} = req.params.pair_id;
//    const pair_id_error =  validate_string_min_max_required(pair_id,c.pair_id_min,c.pair_id_max)
//    if(pair_id_error){
//       return response_format(res,pair_id_error , 'pair_id params')
//    }
//    next()
// }
//# sourceMappingURL=req_validator.js.map