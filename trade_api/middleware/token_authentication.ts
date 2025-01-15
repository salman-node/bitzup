import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utility/utility.functions';
import { prisma } from '../config/prisma_client';

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    console.log({ authorization });

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
      return res.status(400).json({ status: '3', message: 'Something went wrong Please try again!!' });
    }

    const payload: any = await verifyToken(token);
    if (!payload) {
      // throw new Error('You are not authorized');
      return res.status(400).json({ status: '3', message: 'You are not authorized' });
    }


    const user = await prisma.user.findFirst({
      where: { email: payload.email },
    });
    // console.log('user', payload.user_id);
    const authUser = { ...user };
    delete authUser.password;
    req.body.user = authUser;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '0', message: (err as Error).message });
  }
};

export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      // throw new Error('You are not authorized');
      return res.status(400).json({ status: '3', message: 'You are not authorized' });
    }
    console.log(12, authorization);
    if (authorization) {
    
      if (!authorization.startsWith('Bearer ')) {
        // throw new Error('You are not authorized');
        return res.status(400).json({ status: '3', message: 'You are not authorized' });
      }
      const token = authorization.split(' ')[1];

      if (token === 'null' || token === '') {
        // throw new Error('Something went wrong Please try again!!');
        return res.status(400).json({ status: '3', message: 'Something went wrong Please try again!!' });
      }
      const payload: any = await verifyToken(token);
      if (!payload) {
        // throw new Error('You are not authorized');
        return res.status(200).json({ status: '0', message: 'You are not authorized' });
      }
      const user = await prisma.user.findFirst({
        where: { email: payload.email },
      });
      const authUser = { ...user };
      delete authUser.password;
      req.body.user = authUser;
      req.body.login = 'True';
    } else {
      req.body.login = 'False';
    }
    next();
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ status: '0', message: err.message });
  }
};






// import { Request, Response, NextFunction } from 'express';
// import { string } from 'joi';
// import { verify } from 'jsonwebtoken';
// const db = require("../model/db_query");

// export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // getting token from req(header)
//         let token = req.headers["x-api-key"];
//         const user_id = req.params.user_id;
//         console.log(user_id);
//         let userId = user_id;
//         if (!user_id) {
//             const { user_id } = req.body;
//             userId = user_id;
//         }
//         console.log("userId : " + userId);

//         const GetSecretKey = await db.Get_Where_Universal_Data_Specific(
//             "tbl_user_key_details",
//             { cuser_id_btx: userId },
//             ["cuser_id_btx", "secret_key_btx"]
//         );
//         console.log("GetSecretKey : " + GetSecretKey[0]);
//         if (GetSecretKey.length == 0) {
//             return res.status(400).send({
//                 status_code: 400,
//                 status: false,
//                 msg: "Please login.",
//             });
//         }
//         if (!token) token = req.headers["X-Api-Key"];
//         if (!token) {
//             return res.status(400).send({ Error: "Enter x-api-key In Header" });
//         }
//         // token verification
//         let checktoken: any = verify(token, GetSecretKey[0].secret_key_btx);

//         if (!checktoken) {
//             return res.status(404).send({ Status: false, msg: "Enter Valid Token" });
//         }
//         // req.checktoken = checktoken;
//         next();
//     } catch (err) {
//         res.status(500).send({ msg: err.message });
//     }
// };