import nodemailer from 'nodemailer';
// import configuration from '../config/defaults';
import { IClientInfo } from '../types/models.types';
import { otpTemplate } from '../views/otp.template';
import { passwordTemplate } from '../views/password.template';


 // Create a Nodemailer transporter object using SMTP
const transporter =  nodemailer.createTransport({
  host: "smtp.zeptomail.in",
    port: 587,
    auth: {
    user: "emailapikey",
    pass: "PHtE6r1fEOzr3zQt8UMF5fK5R5byNY0sqbtmLVQSsIxBDfRRG01W/9gvmzO/okh7APFGEvKYzIo+ub+csezUczm/PGtOVGqyqK3sx/VYSPOZsbq6x00asV8TckbdVIHpdd9r1SHXs9veNA=="
    }
});


/*----- Send Email with Nodemailer -----*/
const sendEmail = async (
  to: string,
  randomGenPass: string = '',
  otp: string,
  client_info: IClientInfo | undefined,
) => {
  
  const mailOptions = {
    from: 'noreply@bitzup.com',
    to: to,
    subject: randomGenPass
      ? 'Password Successfully Updated'
      : 'Verify Your Email',
    html: randomGenPass ? passwordTemplate(to,randomGenPass,client_info) : otpTemplate(otp,client_info),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/*----- Send OTP Email with Nodemailer -----*/
export const sendOTPEmail = async (
  to: string,
  subject: string,
  otp: string,
  client_info: IClientInfo | undefined,
) => {

  const mailOptions = {
    from: 'noreply@bitzup.com',
    to: to,
    subject: subject,
    html: otpTemplate(otp,client_info)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

export default sendEmail;



// import axios from 'axios';
// import configuration from '../config/defaults';
// import { IClientInfo } from '../types/models.types';
// import { otpTemplate } from '../views/otp.template';
// import { passwordTemplate } from '../views/password.template';

// /*----- Send Email -----*/
// const sendEmail = async (
//   to: string,
//   randomGenPass: string = '',
//   otp: string,
//   client_info: IClientInfo | undefined,
// ) => {
//   // stringify the data object
//   const data = JSON.stringify({
//     from: {
//       address: 'noreply@bitzup.com',
//       name: 'BitzUp',
//     },
//     to: [
//       {
//         email_address: {
//           address: to,
//         },
//       },
//     ],
//     subject: randomGenPass
//       ? 'Password Successfully Updated'
//       : 'Verify Your Email',
//     htmlbody: randomGenPass ? passwordTemplate : otpTemplate,
//     merge_info: {
//       email: to,
//       password: randomGenPass,
//       randomOTP: otp,
//       base_url: configuration.BASE_URL,
//       ip: client_info?.ip,
//       city: client_info?.city,
//       region: client_info?.region,
//       country_name: client_info?.country_name,
//       os_name: client_info?.os_name,
//       client_name: client_info?.client_name,
//       client_type: client_info?.client_type,
//       device: client_info?.device_type,
//     },
//   });

//   // Create a configuration object
//   const config = {
//     method: 'post',
//     url: configuration.zepto_url,
//     headers: {
//       Authorization: configuration.zoho_token,
//       'Content-Type': 'application/json',
//     },
//     data: data,
//   };

//   // Send request
//   axios
//     .request(config)
//     .then(response => {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };

// /*----- Send OTP Email -----*/
// export const sendOTPEmail = async (
//   to: string,
//   subject: string,
//   otp: string,
//   client_info: IClientInfo | undefined,
// ) => {
//   // stringify the data object
//   const data = JSON.stringify({
//     from: {
//       address: 'noreply@bitzup.com',
//       name: 'BitzUp',
//     },
//     to: [
//       {
//         email_address: {
//           address: to,
//         },
//       },
//     ],
//     subject: subject,
//     htmlbody: otpTemplate,
//     merge_info: {
//       randomOTP: otp,
//       base_url: configuration.BASE_URL,
//       ip: client_info?.ip,
//       city: client_info?.city,
//       region: client_info?.region,
//       country_name: client_info?.country_name,
//       os_name: client_info?.os_name,
//       client_name: client_info?.client_name,
//       client_type: client_info?.client_type,
//       device: client_info?.device_type,
//     },
//   });

//   // Create a configuration object
//   const config = {
//     method: 'post',
//     url: configuration.zepto_url,
//     headers: {
//       Authorization: configuration.zoho_token,
//       'Content-Type': 'application/json',
//     },
//     data: data,
//   };

//   // Send request
//   axios
//     .request(config)
//     .then(response => {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };

// export default sendEmail;
