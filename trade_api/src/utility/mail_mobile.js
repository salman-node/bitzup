// Import All The Required Pakagesconst 
Nodemailer = require("nodemailer");
let axios = require("axios");
require("dotenv").config();
// Define Send Email Controller Functionality
module.exports.SendEmail = (
  Heading,
  To,
  BankName,
  AccountNumber,
  IFSCCODE,
  UPI,
  DESCRIPTION
) => {
  const SMTP_Transport = Nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL_ADDRESS,
      pass: process.env.SENDER_APP_PASSWORD,
    },
  });
  const MailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: To,
    subject: "P2P Advertise Matched.",
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">       
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">${Heading}</h2>   
                    <p>${DESCRIPTION}</p>    
         <p style="text-align: center; text-transform: uppercase;color: teal;">${BankName}</p> 
         <p style="text-align: center; text-transform: uppercase;color: teal;">${AccountNumber}</p>   
         <p style="text-align: center; text-transform: uppercase;color: teal;">${IFSCCODE}</p>   
         <p style="text-align: center; text-transform: uppercase;color: teal;">${UPI}</p>            
                </div>         `,
  };
  const info = SMTP_Transport.sendMail(MailOptions, (error, information) => {
    if (error) {
      return error;
    } else {
      return information;
    }
  });
  return "emailSent";
  // console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info))
};

// use axios for send otp on mobile no
module.exports.SendMobileOtp = async (mobile_no, otp) => {
  try {
    let options = {
      method: "get",
      url: `https://www.tripadasmsbox.com/api/sendapi.php?auth_key=3199NprUZBg1DkkdJr7vUs&mobiles=91${mobile_no}&templateid=1207167661631664139&peid=1201159567493949851&message=Your order: ${otp} matched for selling USDT.&sender=BCXVRF&route=4`,
    };
    let result = await axios(options);
    console.log(result);
    let data = result.data;
    return "mobile_sms_sent";
  } catch (err) {
    console.log(err);
    // res.send({ msg: err.message });
  }
};
