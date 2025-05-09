const dotenv = require('dotenv');;

dotenv.config();

// export const otpTemplate = `<html lang='en'>
// <head>
//   <meta charset='UTF-8' />
//   <meta name='viewport' content='width=device-width, initial-scale=1.0' />
//   <meta http-equiv='X-UA-Compatible' content='ie=edge' />
//   <title>Suncrypto</title>
//   <link rel='preconnect' href='https://fonts.googleapis.com' />
//   <link rel='preconnect' href='https://fonts.gstatic.com' />
//   <link
//     href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora&family=Montserrat:ital,wght@0,700;1,100&family=Roboto+Slab:wght@500&display=swap'
//     rel='stylesheet'
//   />
// </head>

// <body style='margin: 0px'>
//   <div style='width: 100%; text-align: center; padding-top: 50px'>
//     <img src="${process.env.ICON_URL}/images/logo.png" alt="logo" />
//   </div>
//   <div style='background-color: #f7f7f7'>
//     <div style='width: 100%'>
//       <p
//         style='
//           color: #000;
//           font-size: 18px;
//           font-family: Poppins, sans-serif;
//           font-weight: 600;
//           margin-left: 30px;
//           padding-top: 40px;
//         '
//       >
//         Dear Valued User,
//       </p>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           margin-top: 50px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//         '
//       >
//         Your security is our top priority at Bitzup! We ensure the utmost
//         protection for your crypto assets, Your One-Time Password (OTP) Is
//       </p>
//       <center>
//         <button
//           style='
//             background-color: #d9d9d9;
//             padding: 20px 40px;
//             font-size: 60px;
//             font-family: Poppins, sans-serif;
//             font-weight: 600;
//             border: 0px solid #000;
//             border-radius: 15px;
//             margin-bottom: 30px;
//             margin-top: 30px;
//           '
//         >
//           {{randomOTP}}
//         </button>
//       </center>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           margin-top: 50px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//           margin-bottom: 30px;
//         '
//       >
//         <img src='${process.env.ICON_URL}/images/lock.png alt='lock'' width='40' />
//         Recent OTP Alert Details
//         <img src='${process.env.ICON_URL}/images/lock.png' width='40' />
//       </p>
//       <div
//         style='
//           margin-left: 30px;
//           margin-right: 30px;
//           padding-bottom: 10px;
//           padding-top: 10px;
//           border-radius: 15px;
//           border: 5px solid #ffc107;
//         '
//       >
//         <p
//           style='
//             color: #000;
//             font-size: 15px;
//             font-family: Poppins, sans-serif;
//             font-weight: 500;
//             margin-left: 30px;
//             margin-right: 30px;
//           '
//         >
//           IP Address:
//           <b> [{{ip}}]</b>
//         </p>
//         <p
//           style='
//             color: #000;
//             font-size: 15px;
//             margin-top: 50px;
//             font-family: Poppins, sans-serif;
//             font-weight: 500;
//             margin-left: 30px;
//             margin-right: 30px;
//             margin-top: 0px;
//           '
//         >
//           Location:
//           <b> [{{city}}, {{region}}, {{country_name}}]</b>
//         </p>
//         <p
//           style='
//             color: #000;
//             font-size: 15px;
//             margin-top: 50px;
//             font-family: Poppins, sans-serif;
//             font-weight: 500;
//             margin-left: 30px;
//             margin-right: 30px;
//             margin-top: 0px;
//           '
//         >
//           Device:
//           <b> [{{client_name}}, {{os_name}}, {{device_type}}]</b>
//         </p>
//       </div>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           margin-top: 50px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//         '
//       >
//         If you did not initiate this login or require assistance, please
//         contact our support team immediately at
//         <a href='#'> help@bitzup.com</a>
//       </p>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           margin-top: 50px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//         '
//       >
//         Thank you for choosing Bitzup for your crypto needs. Safe trading!
//       </p>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//         '
//       >
//         Best regards,
//       </p>
//       <p
//         style='
//           color: #000;
//           font-size: 15px;
//           font-family: Poppins, sans-serif;
//           font-weight: 500;
//           margin-left: 30px;
//           margin-right: 30px;
//           margin-top: 0px;
//           padding-bottom: 50px;
//         '
//       >
//         <b> The Bitzup Team</b>
//       </p>
//     </div>
//   </div>

//   <div>
//     <p
//       style='
//         color: #ff6767;
//         font-size: 12px;
//         font-family: Poppins, sans-serif;
//         font-weight: 500;
//         margin-left: 30px;
//         margin-right: 30px;
//         text-align: center;
//         margin-top: 20px;
//       '
//     >
//       Note: Never share your account passwords with anyone and change them
//       from time to time to keep the account safe from breaches.
//     </p>
//     <center>
//       <ul style='list-style: none; display: inline-flex'>
//         <li style='margin: 10px'>
//           <a href='#' target='blank'>
//             <img src='${process.env.ICON_URL}/images/instagram.png' width='60' /></a>
//         </li>
//         <li style='margin: 10px'>
//           <a href='#' target='blank'>
//             <img src='${process.env.ICON_URL}/images/facebook.png' width='60' /></a>
//         </li>
//         <li style='margin: 10px'>
//           <a href='#' target='blank'>
//             <img src='${process.env.ICON_URL}/images/telegram.png' width='60' /></a>
//         </li>
//         <li style='margin: 10px'>
//           <a href='#' target='blank'>
//             <img src='${process.env.ICON_URL}/images/youtube.png' width='60' /></a>
//         </li>
//       </ul>
//     </center>
//   </div>
//   <div>
//     <a href='#' target='blank' style='text-decoration: none'><p
//         style='
//           color: #000;
//           font-family: Poppins, sans-serif;
//           font-size: 12px;
//           margin-bottom: 20px;
//           text-align: center;
//           font-weight: 600;
//         '
//       >
//         Copyright 2022-23 Bitzup All Rights Reserved
//       </p></a>
//   </div>
//   <div style='text-align: center; margin-top: 30px; font-size: 10px'>
//     <p
//       style='
//         margin-left: 40px;
//         margin-right: 40px;
//         font-family: Poppins, sans-serif;
//         font-weight: 400;
//         color: #7e7e7e;
//         margin-top: -20px;
//       '
//     >
//       Cryptocurrency is not legal tender and does not come with any legal
//       protection. Your investment is subject to volatility and risk. Please
//       exercise caution before investing.
//     </p>
//   </div>
// </body>
// </html>`;

export const otpTemplate=(otp:any,client_info:any)=>{
   console.log(client_info)
  const otpTemplate= `<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <meta http-equiv='X-UA-Compatible' content='ie=edge' />
    <title>Suncrypto</title>
    <link rel='preconnect' href='https://fonts.googleapis.com' />
    <link rel='preconnect' href='https://fonts.gstatic.com' />
    <link
      href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora&family=Montserrat:ital,wght@0,700;1,100&family=Roboto+Slab:wght@500&display=swap'
      rel='stylesheet'
    />
  </head>
  
  <body style='margin: 0px'>
    <div style='width: 100%; text-align: center; padding-top: 50px'>
      <img src="${process.env.ICON_URL}/images/logo.png" alt="logo" />
    </div>
    <div style='background-color: #f7f7f7'>
      <div style='width: 100%'>
        <p
          style='
            color: #000;
            font-size: 18px;
            font-family: Poppins, sans-serif;
            font-weight: 600;
            margin-left: 30px;
            padding-top: 40px;
          '
        >
          Dear Valued User,
        </p>
        <p
          style='
            color: #000;
            font-size: 15px;
            margin-top: 50px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
          '
        >
          Your security is our top priority at Bitzup! We ensure the utmost
          protection for your crypto assets, Your One-Time Password (OTP) Is
        </p>
        <center>
          <button
            style='
              background-color: #d9d9d9;
              padding: 20px 40px;
              font-size: 60px;
              font-family: Poppins, sans-serif;
              font-weight: 600;
              border: 0px solid #000;
              border-radius: 15px;
              margin-bottom: 30px;
              margin-top: 30px;
            '
          >
            ${otp}
          </button>
        </center>
        <p
          style='
            color: #000;
            font-size: 15px;
            margin-top: 50px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
            margin-bottom: 30px;
          '
        >
          Recent OTP Alert Details
          <img src='${process.env.ICON_URL}/images/lock.png' width='20' height='20' />
        </p>
        <div
          style='
            margin-left: 30px;
            margin-right: 30px;
            padding-bottom: 10px;
            padding-top: 10px;
            border-radius: 15px;
            border: 5px solid #ffc107;
          '
        >
          <p
            style='
              color: #000;
              font-size: 15px;
              font-family: Poppins, sans-serif;
              font-weight: 500;
              margin-left: 30px;
              margin-right: 30px;
            '
          >
            IP Address:
            <b> ${client_info?.ip}</b>
          </p>
          <p
            style='
              color: #000;
              font-size: 15px;
              margin-top: 50px;
              font-family: Poppins, sans-serif;
              font-weight: 500;
              margin-left: 30px;
              margin-right: 30px;
              margin-top: 0px;
            '
          >
            Location:
            <b> ${client_info?.location}</b>
          </p>
          <p
            style='
              color: #000;
              font-size: 15px;
              margin-top: 50px;
              font-family: Poppins, sans-serif;
              font-weight: 500;
              margin-left: 30px;
              margin-right: 30px;
              margin-top: 0px;
            '
          >
            Device:
            <b> ${client_info?.device_type}, ${JSON.parse(client_info?.device_info).device_model}</b>
          </p>
        </div>
        <p
          style='
            color: #000;
            font-size: 15px;
            margin-top: 50px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
          '
        >
          If you did not initiate this login or require assistance, please
          contact our support team immediately at
          <a href='#'> help@bitzup.com</a>
        </p>
        <p
          style='
            color: #000;
            font-size: 15px;
            margin-top: 50px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
          '
        >
          Thank you for choosing Bitzup for your crypto needs. Safe trading!
        </p>
        <p
          style='
            color: #000;
            font-size: 15px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
          '
        >
          Best regards,
        </p>
        <p
          style='
            color: #000;
            font-size: 15px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            margin-left: 30px;
            margin-right: 30px;
            margin-top: 0px;
            padding-bottom: 50px;
          '
        >
          <b> The Bitzup Team</b>
        </p>
      </div>
    </div>
  
    <div>
      <p
        style='
          color: #ff6767;
          font-size: 12px;
          font-family: Poppins, sans-serif;
          font-weight: 500;
          margin-left: 30px;
          margin-right: 30px;
          text-align: center;
          margin-top: 20px;
        '
      >
        Note: Never share your account passwords with anyone and change them
        from time to time to keep the account safe from breaches.
      </p>
      <center>
        <ul style='list-style: none; display: inline-flex'>
          <li style='margin: 10px'>
            <a href='#' target='blank'>
              <img src='${process.env.ICON_URL}/images/instagram.png' width='60' /></a>
          </li>
          <li style='margin: 10px'>
            <a href='#' target='blank'>
              <img src='${process.env.ICON_URL}/images/facebook.png' width='60' /></a>
          </li>
          <li style='margin: 10px'>
            <a href='#' target='blank'>
              <img src='${process.env.ICON_URL}/images/telegram.png' width='60' /></a>
          </li>
          <li style='margin: 10px'>
            <a href='#' target='blank'>
              <img src='${process.env.ICON_URL}/images/youtube.png' width='60' /></a>
          </li>
        </ul>
      </center>
    </div>
    <div>
      <a href='#' target='blank' style='text-decoration: none'><p
          style='
            color: #000;
            font-family: Poppins, sans-serif;
            font-size: 12px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
          '
        >
          Copyright 2022-23 Bitzup All Rights Reserved
        </p></a>
    </div>
    <div style='text-align: center; margin-top: 30px; font-size: 10px'>
      <p
        style='
          margin-left: 40px;
          margin-right: 40px;
          font-family: Poppins, sans-serif;
          font-weight: 400;
          color: #7e7e7e;
          margin-top: -20px;
        '
      >
        Cryptocurrency is not legal tender and does not come with any legal
        protection. Your investment is subject to volatility and risk. Please
        exercise caution before investing.
      </p>
    </div>
  </body>
  </html>`

  return otpTemplate

}
