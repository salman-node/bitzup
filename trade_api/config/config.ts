import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentVariables {
  port: string;
  JWT_secret_key: string;
  HTTP_BAD_REQUEST: number;
  HTTP_UNAUTHORISED: number;
  HTTP_FORBIDDEN: number;
  HTTP_NOTFOUND: number;
  HTTP_SERVER_ERROR: number;
  HTTP_SUCCESS: number;
  HTTP_SUCCESSFULLY_CREATED: number;
  binance_apiKey:string; 
  api_secret:string;
  binance_url:string;
}

const config: EnvironmentVariables = {
  port: process.env.port,
  JWT_secret_key: process.env.JWT_secret_key || '12345-55555-09876-54321',
  HTTP_BAD_REQUEST: parseInt(process.env.HTTP_BAD_REQUEST, 10),
  HTTP_UNAUTHORISED: parseInt(process.env.HTTP_UNAUTHORISED, 10),
  HTTP_FORBIDDEN: parseInt(process.env.HTTP_FORBIDDEN, 10),
  HTTP_NOTFOUND: parseInt(process.env.HTTP_NOTFOUND, 10),
  HTTP_SERVER_ERROR: parseInt(process.env.HTTP_SERVER_ERROR, 10),
  HTTP_SUCCESS: parseInt(process.env.HTTP_SUCCESS, 10),
  HTTP_SUCCESSFULLY_CREATED: parseInt(process.env.HTTP_SUCCESSFULLY_CREATED, 10),
  binance_apiKey:process.env.binance_apiKey || 'gppTzIeLcnA2uAf8E0Hwda9RcwsIPoBdoA0dsqbU0AEXmLCRDccArhGMa4r71H3x',
  api_secret:process.env.api_secret || 'LDIUwHvnrSapjMrUb7xQLw4HfQbRBs2cBCEn96vLmHDl85fntvknGYr7jS6VIisE',
  binance_url:process.env.binance_url || "https://testnet.binance.vision"
};

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