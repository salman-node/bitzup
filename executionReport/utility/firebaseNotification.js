const admin = require('firebase-admin')
require('dotenv').config()
exports.sendNotification = async (
    fcm_token,
    title,
    body,
  ) => {
    try {
        console.log(admin)
      if (!admin.apps.length) {
      const serviceAccount = {
        type: process.env.FIREBASE_TYPE || '',
        project_id: process.env.FIREBASE_PROJECT_ID || '',
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
        private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
          /\\n/g,
          '\n',
        ),
        client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
        client_id: process.env.FIREBASE_CLIENT_ID || '',
        auth_uri: process.env.FIREBASE_AUTH_URI || '',
        token_uri: process.env.FIREBASE_TOKEN_URI || '',
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || '',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
        universe_domain: 'googleapis.com',
      };
  
      admin.initializeApp({
        credential: admin.credential.cert(Object(serviceAccount)),
      });
    }
  
      // Check if FCM token is provided
      if (!fcm_token) {
        console.log('Fcm token is not provided');
      }
  
      // Send the notification using the FCM token
      const response = await admin.messaging().send({
        token: fcm_token,
        notification: {
          title,
          body,
        },
        // data: {
        //   click_action: 'YOUR_ACTION',
        // },
      });
      
  
      // Handle the response
      console.log('Notification sent:', response);
      // return {
      //   verified: true,
      //   msg: "Notification sent",
      // };
    } catch (error) {
      console.log('Error in Sending Notifications: ',error,error.message);
      // return {
      //   verified: false,
      //   msg: (error as Error).message,
      // };
    }
  };