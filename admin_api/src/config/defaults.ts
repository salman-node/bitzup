import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: 10008,
  saltworkFactor: 10,
  jwtsecret: process.env.JWT_SECRET,
  jwtExp: '100d',
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:10008'
      : 'http://192.46.213.147:10008',
  zoho_token: process.env.ZOHO_TOKEN,
  zepto_url: 'https://api.zeptomail.in/v1.1/email',
};
