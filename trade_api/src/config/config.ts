import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentVariables {
  port: string | number;
  JWT_secret_key: string;
  HTTP_BAD_REQUEST: string | number;
  HTTP_UNAUTHORISED: number;
  HTTP_FORBIDDEN: number;
  HTTP_NOTFOUND: number;
  HTTP_SERVER_ERROR: number;
  HTTP_SUCCESS: number;
  HTTP_SUCCESSFULLY_CREATED: number;
  REDIS_HOST:string;
  REDIS_PORT:number;
  REDIS_USER:string;
  REDIS_AUTH:string;
}

const config: EnvironmentVariables = {
  port: process.env.PORT || 10007,
  JWT_secret_key: process.env.JWT_secret_key || '12345-55555-09876-54321',
  HTTP_BAD_REQUEST: process.env.HTTP_BAD_REQUEST || '400',
  HTTP_UNAUTHORISED: parseInt(process.env.HTTP_UNAUTHORISED || '401', 10),
  HTTP_FORBIDDEN: parseInt(process.env.HTTP_FORBIDDEN || '403', 10),
  HTTP_NOTFOUND: parseInt(process.env.HTTP_NOTFOUND || '404', 10),
  HTTP_SERVER_ERROR: parseInt(process.env.HTTP_SERVER_ERROR || '500', 10),
  HTTP_SUCCESS: parseInt(process.env.HTTP_SUCCESS || '200', 10),
  HTTP_SUCCESSFULLY_CREATED: parseInt(process.env.HTTP_SUCCESSFULLY_CREATED || '201', 10),
 
  //redis connection details
  REDIS_HOST: process.env.REDIS_HOST || 'redis-18514.c322.us-east-1-2.ec2.redns.redis-cloud.com',
  REDIS_PORT:  18514,
  REDIS_USER: process.env.REDIS_USER || 'default',
  REDIS_AUTH: process.env.REDIS_AUTH || 'blE32GqYBT9dHDyopO1tiG10AKOuW0C8',
};

export const AdminTradeAccounts = [
  {
    name: process.env.AccountName1 || 'BinanceAccount1',
    binance_url: process.env.BINANCE_URL1 || "https://testnet.binance.vision",
    apiKey: process.env.BINANCE_API_KEY_1 || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
    apiSecret: process.env.BINANCE_API_SECRET_1 || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
    binance_ws_url: process.env.BINANCE_WS_URL1 || "wss://testnet.binance.vision",
  },
  {
    name: process.env.AccountName2 || 'BinanceAccount2',
    binance_url: process.env.BINANCE_URL2 || "https://testnet.binance.vision",  // mainnet url
    apiKey: process.env.BINANCE_API_KEY_2 || 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om',
    apiSecret: process.env.BINANCE_API_SECRET_2 || 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW',
    binance_ws_url: process.env.BINANCE_WS_URL2 ||  "wss://testnet.binance.vision"        ///"wss://stream.binance.com:9443",
  }
  // Add more accounts as needed
];


// interface ErrorCodes {
//   user_id_required: number;
//   asset_id_required: number;
//   admin_id_required: number;
//   quote_volume_required: number;
//   pair_id_required: number;
//   last_name_required: number;
//   inactive_asset: number;
//   curret_rate_not_fetched: number;
//   database_error: number;
//   ip_required: number;
//   coordinate_required: number;
//   required_fields: number;
//   not_valid_input: number;
//   kyc_incomplete: number;
//   pair_not_registered: number;
//   not_asset_fiat_pair: number;
//   insufficient_balance: number;
//   user_not_found: number;
//   user_fiat_balance_row_missing: number;
//   user_crypto_balance_row_missing: number;
//   invalid_ordertype: number;
//   unauthorised_access: number;
//   invalid_activity_type: number;
//   invalid_otp_type: number;
//   invalid_request_type: number;
//   invalid_wallet_type: number;
//   invalid_request_data: number;
//   invalid_request: number;
//   db_data_not_fetched: number;
//   asset_not_registered: number;
// }

// const errorCodes: ErrorCodes = {
//   user_id_required: 10001,
//   asset_id_required: 10002,
//   admin_id_required: 10003,
//   quote_volume_required: 10004,
//   pair_id_required: 10005,
//   last_name_required: 10007,
//   inactive_asset: 10008,
//   curret_rate_not_fetched: 10009,
//   database_error: 10010,
//   ip_required: 10011,
//   coordinate_required: 10012,
//   required_fields: 14001,
//   not_valid_input: 14002,
//   kyc_incomplete: 14003,
//   pair_not_registered: 14006,
//   not_asset_fiat_pair: 14009,
//   insufficient_balance: 14004,
//   user_not_found: 14005,
//   user_fiat_balance_row_missing: 14008,
//   user_crypto_balance_row_missing: 14018,
//   invalid_ordertype: 14007,
//   unauthorised_access: 14010,
//   invalid_activity_type: 14011,
//   invalid_otp_type: 14012,
//   invalid_request_type: 14013,
//   invalid_wallet_type: 14014,
//   invalid_request_data: 14015,
//   invalid_request: 14016,
//   db_data_not_fetched: 14017,
//   asset_not_registered: 14018,
// };

export { config };