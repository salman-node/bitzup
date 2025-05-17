import * as dotenv from 'dotenv';
dotenv.config();

export default {
  port: 4002,
  saltworkFactor: 10,
  jwtsecret: process.env.JWT_SECRET,
  jwtExp: '100d',
  BASE_URL:
    process.env.APP_ENV === 'development'
      ? 'http://localhost:4002'
      : 'http://192.46.213.147:4002',
  zoho_token: process.env.ZOHO_TOKEN,
  zepto_url: 'https://api.zeptomail.in/v1.1/email',

  //branch.io config
  BRANCH_API_KEY: process.env.BRANCH_API_KEY || "key_live_kytokIlXMetFwlYFIkVI7gkduspuWhYs",
  BRANCH_SECRET_KEY: process.env.BRANCH_SECRET_KEY,
  BRANCH_URL : process.env.BRANCH_URL || 'https://api2.branch.io/v1/url',
  IOS_URL: process.env.IOS_URL || "https://i.diawi.com/sZXPEr",
  ANDROID_URL: process.env.ANDROID_URL ,
  
};
