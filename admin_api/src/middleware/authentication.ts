// import { Request, Response, NextFunction } from 'express';
// import { prisma } from '../config/prisma.client';
// import { IUserPartial } from '../types/models.types';

// export const verifyUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { authorization } = req.headers;
//     console.log({ authorization });

//     if (!authorization) {
//       // throw new Error('You are not authorized');
//       return res.status(400).json({ status: '3', message: 'You are not authorized' });
//     } else if (!authorization.startsWith('Bearer ')) {
//       // throw new Error('You are not authorized');
//       return res.status(400).send({ status: '3', message: 'You are not authorized' });
//     }

//     const token = authorization.split(' ')[1];

//     if (token === 'null' || token === '' || token === 'undefined') {
//       // throw new Error('Something went wrong Please try again!!');
//       return res.status(400).json({ status: '3', message: 'Something went wrong Please try again!!' });
//     }

//     const payload: any = await verifyToken(token);
//     if (!payload) {
//       // throw new Error('You are not authorized');
//       return res.status(400).json({ status: '3', message: 'You are not authorized' });
//     }


//     const user = await prisma.user.findFirst({
//       where: { user_id: payload.user_id },
//     });
//     console.log('user', payload.user_id);
//     const authUser = { ...user } as IUserPartial;
//     delete authUser.password;
//     req.body.user = authUser;

//     next();
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

// export const checkLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       // throw new Error('You are not authorized');
//       return res.status(400).json({ status: '3', message: 'You are not authorized' });
//     }
//     console.log(12, authorization);
//     if (authorization) {
    
//       if (!authorization.startsWith('Bearer ')) {
//         // throw new Error('You are not authorized');
//         return res.status(400).json({ status: '3', message: 'You are not authorized' });
//       }
//       const token = authorization.split(' ')[1];

//       if (token === 'null' || token === '') {
//         // throw new Error('Something went wrong Please try again!!');
//         return res.status(400).json({ status: '3', message: 'Something went wrong Please try again!!' });
//       }
//       const payload: any = await verifyToken(token);
//       if (!payload) {
//         // throw new Error('You are not authorized');
//         return res.status(200).json({ status: '0', message: 'You are not authorized' });
//       }
//       const user = await prisma.user.findFirst({
//         where: { user_id: payload.user_id },
//       });
//       const authUser = { ...user };
//       delete authUser.password;
//       req.body.user = authUser;
//       req.body.login = 'True';
//     } else {
//       req.body.login = 'False';
//     }
//     next();
//   } catch (err: any) {
//     res.status(500).json({ status: '0', message: err.message });
//   }
// };
