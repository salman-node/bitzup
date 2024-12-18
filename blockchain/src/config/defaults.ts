import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: 4004,
  saltworkFactor: 10,
  jwtsecret: process.env.JWT_SECRET || '12345-55555-09876-54321',
  jwtExp: '100d',
  ICON_URL1: process.env.ICON_URL1 ||"http://172.105.52.30:4002",
  ICON_URL: process.env.ICON_URL ||"http://172.105.52.30:4002",
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:4004'
      : 'http://192.46.213.147:4004',
  zoho_token: process.env.ZOHO_TOKEN,
  zepto_url: 'https://api.zeptomail.in/v1.1/email',
};
