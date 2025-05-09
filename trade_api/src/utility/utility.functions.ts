import jwt from 'jsonwebtoken';
import config from '../config/defaults';
import { prisma } from '../config/prisma_client';
import { JwtPayload } from 'jsonwebtoken';
const dotenv = require('dotenv');;
import axios from 'axios';

dotenv.config();



/*----- Generate token -----*/
export const getToken = async (user_id: string) => {
  if (!config.jwtsecret) {
    throw new Error('JWT secret is not defined in the configuration.');
  }

  // get token_string and email from user table
  const token_data = await prisma.user.findFirst({
    where: {
      user_id: user_id,
    },
    select: {
      token_string: true,
      email: true
    }
  })
  if (!token_data) {
    throw new Error('User not found.');
  }
  const token_string = token_data.token_string;
  const email = token_data.email;

  return jwt.sign({ token_string: token_string, email: email }, config.jwtsecret, {
    expiresIn: '100d',
  });
};


/*----- Verify token -----*/
export const verifyToken = async (token: string) => {
  return new Promise(async (resolve, reject) => {
    if (!config.jwtsecret) {
      throw new Error('JWT secret is not defined in the configuration.');
    }
    jwt.verify(token, config.jwtsecret, async (err, _decoded: any) => {
      if (!config.jwtsecret) {
        throw new Error('JWT secret is not defined in the configuration.');
      }
      const payload: JwtPayload | string = jwt.verify(token, config.jwtsecret);
      if (typeof payload === 'string') {
        throw new Error('Token is not valid.');
      }
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return new Error('Session expired, please login again.');
          // Token is expired, generate a new token
          // try {
          //   const user:any = await prisma.$queryRaw`
          //   SELECT * from user where email = ${payload.email} and token_string = ${payload.token_string};`;
          //   const newToken = await getToken(user.email);
          //   await prisma.$queryRaw`
          //   UPDATE user SET token = ${newToken} where email = ${payload.email};`;
          //   resolve(payload);
          // } catch (error) {
          //   reject(error);
          // }
        } else {
          reject(err);
        }
      } else {
        resolve(payload);
      }
    });
  });
};

export async function getIplocation(ip: string) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;
    if (data.status === 'success') {
      return  `${data.city}, ${data.regionName}, ${data.country}`;
    } else {
      return  'Unknown';
    }
  } catch (err:any) {
    console.error('Failed to fetch location from IP:', err.message);
    return  'Unknown';
  }
}
