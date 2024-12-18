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
//# sourceMappingURL=token_authentication.js.map