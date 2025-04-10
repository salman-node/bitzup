import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/utility.functions';
import { prisma } from '../config/prisma.client';
import { IUserPartial } from '../types/models.types';

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
  

    if (!authorization) {
      // throw new Error('You are not authorized');
      return res.status(400).json({ status: '3', message: 'You are not authorized' });
    } else if (!authorization.startsWith('Bearer ')) {
      // throw new Error('You are not authorized');
      return res.status(400).send({ status: '3', message: 'You are not authorized' });
    }

    const token = authorization.split(' ')[1];

    if (token === 'null' || token === '' || token === 'undefined') {
      // throw new Error('Something went wrong Please try again!!');
      return res.status(400).json({ status: '3', message: 'You are not authorized' });
    }

    const payload: any = await verifyToken(token);
    if (!payload) {
      // throw new Error('You are not authorized');
      return res.status(400).json({ status: '3', message: 'You are not authorized' });
    }

    const user = await prisma.user.findFirst({
      where: { email: payload.email },
    });


    if(user?.token_string !== payload.token_string) {
      return res.status(400).json({ status: '3', message: 'You are not authorized' });  
    }
    
    const authUser = { ...user } as IUserPartial;
    req.body.user = { user_id: authUser.user_id,secret_key: authUser.secret_key}
    
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '0', message: (err as Error).message });
  }
};


