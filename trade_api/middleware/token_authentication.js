const jwt = require("jsonwebtoken");
const db = require("../model/db_query");

const AdminAuthentication = async function (req, res, next) {
  try {
    const admin_id = req.params.admin_id;
    var adminId = admin_id;
    if (!admin_id) {
      const { admin_id } = req.body;
      adminId = admin_id;
    }

    const GetSecretKey = await db.Get_Where_Universal_Data_Specific(
      "tbl_user_key_details",
      { cuser_id_btx: adminId },
      ["cuser_id_btx", "secret_key_btx"]
    );
 
    if (GetSecretKey.length == 0) {
      return res.status(400).send({
        status_code: 400,
        status: false,
        msg: "Invalid token. please check token",
      });
    }
    let token = req.headers["x-api-key"];

    if (!token) token = req.headers["X-Api-Key"];
    if (!token) {
      return res.status(400).send({ Error: "Enter x-api-key In Header" });
    }
    // token verification

    let checktoken = jwt.verify(token, GetSecretKey[0].secret_key_btx);

    if (!checktoken) {
      return res.status(404).send({ Status: false, msg: "Enter Valid Token" });
    }
    req.checktoken = checktoken;
    next();
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};


const Authentication = async function (req, res, next) {
  try {
    // getting token from req(header)
    let token = req.headers["x-api-key"];
    const user_id = req.params.user_id;

    var userId = user_id;
    if (!user_id) {
      const { user_id } = req.body;
      userId = user_id;
    }

    //     const GetTokenDetails = await db.Get_Where_Universal_Data_Specific("tbl_user_registration_master",{clogin_jwt_btx:token},["cuser_id_btx","clogin_jwt_btx"])    //     console.log("GetTokenDetails : " + GetTokenDetails);    //    if(GetTokenDetails.length == 0){    //     return res.status(400).send({    //         status_code: 400,    //         status: false,    //         msg: "Invalid token",    //       });    //    }
    const GetSecretKey = await db.Get_Where_Universal_Data_Specific(
      "tbl_user_key_details",
      { cuser_id_btx: userId },
      ["cuser_id_btx", "secret_key_btx"]
    );
    console.log("GetSecretKey : " + GetSecretKey[0]);
    if (GetSecretKey.length == 0) {
      return res.status(400).send({
        status_code: 400,
        status: false,
        msg: "Please login.",
      });

    }
    if (!token) token = req.headers["X-Api-Key"];
    console.log(token);
    if (!token) {
      return res.status(400).send({ Error: "Enter x-api-key In Header" });
    }
    // token verification

    let checktoken = jwt.verify(token, GetSecretKey[0].secret_key_btx);
 
    if (!checktoken) {
      return res.status(404).send({ Status: false, msg: "Enter Valid Token" });
    }
    req.checktoken = checktoken;
    next();
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

module.exports.Authentication = Authentication;
module.exports.AdminAuthentication = AdminAuthentication;
