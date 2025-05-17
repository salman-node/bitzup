// const axios = require('axios');
const BRANCH_SECRET = 'secret_live_9uLPOkiyeqp2iYPNJtbA3WZcwclfgbBM';
// const createLink = async () => {
//   const response = await axios.post('https://api2.branch.io/v1/url', {
//     branch_key: 'key_live_kytokIlXMetFwlYFIkVI7gkduspuWhYs',
//     branch_secret: BRANCH_SECRET,
//     data: {
//       '$canonical_identifier': 'user/referral',
//       'referralCode': 'user123',
//       '$og_title': 'Join MyApp',
//       '$og_description': 'Use this referral and get a reward!',
//     },
//   });
//   console.log('Branch link:', response.data.url);
// };
// createLink().catch((error) => {
//   console.error('Error creating Branch link:', error);
// }
// );

const axios = require('axios');

const createLink = async () => {
  const response = await axios.post('https://api2.branch.io/v1/url', {
    branch_key: 'key_live_kytokIlXMetFwlYFIkVI7gkduspuWhYs',
    data: {
      '$canonical_identifier': 'user/referral/user123',
      'referralCode': 'user123',
      '$og_title': 'Join MyApp',
      '$channel': 'whatsapp',
      '$og_description': 'Use this referral and get a reward!',
      "$fallback_url": "https://i.diawi.com/pgfje3"
    },
  });
  console.log('Branch link:', response.data.url);
};

createLink().catch((error) => {
  console.error('Error creating Branch link:', error.response?.data || error.message);
});
