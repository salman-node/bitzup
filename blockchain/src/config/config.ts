// import dotenv from 'dotenv';
// dotenv.config();

// interface EnvironmentVariables {
//   port: string;
//   JWT_secret_key: string;
//   HTTP_BAD_REQUEST: number;
//   HTTP_UNAUTHORISED: number;
//   HTTP_FORBIDDEN: number;
//   HTTP_NOTFOUND: number;
//   HTTP_SERVER_ERROR: number;
//   HTTP_SUCCESS: number;
//   HTTP_SUCCESSFULLY_CREATED: number;
//   binance_apiKey:string; 
//   api_secret:string;
//   binance_url:string;
// }

// const config: EnvironmentVariables = {
//   port: process.env.port,
//   JWT_secret_key: process.env.JWT_secret_key || '12345-55555-09876-54321',
//   HTTP_BAD_REQUEST: parseInt(process.env.HTTP_BAD_REQUEST, 10),
//   HTTP_UNAUTHORISED: parseInt(process.env.HTTP_UNAUTHORISED, 10),
//   HTTP_FORBIDDEN: parseInt(process.env.HTTP_FORBIDDEN, 10),
//   HTTP_NOTFOUND: parseInt(process.env.HTTP_NOTFOUND, 10),
//   HTTP_SERVER_ERROR: parseInt(process.env.HTTP_SERVER_ERROR, 10),
//   HTTP_SUCCESS: parseInt(process.env.HTTP_SUCCESS, 10),
//   HTTP_SUCCESSFULLY_CREATED: parseInt(process.env.HTTP_SUCCESSFULLY_CREATED, 10),
//   binance_apiKey:process.env.binance_apiKey || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
//   api_secret:process.env.api_secret || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
//   binance_url:process.env.binance_url || "https://testnet.binance.vision"
// };

// export { config };