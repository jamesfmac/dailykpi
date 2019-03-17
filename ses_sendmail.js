
//load .env file unless in production mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
};


// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});



// Create sendEmail params 
var params = {
  Destination: { /* required */ 
    CcAddresses: [
     
      /* more items */
    ],
    ToAddresses: [ 
      'jfmcmanamey@gmail.com'
      /* more items */
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
       Charset: "UTF-8",
       Data: "<html><p>Hey James, </p> </p>These are your numbers for today </p> </html> "
      },
      Text: {
       Charset: "UTF-8",
       Data: "This is the fallback text" 
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Test email'
     }
    },
  Source: 'noreply@kpialert.com', /* required */
  ReplyToAddresses: [
     'noreply@kipalert.com',
    /* more items */
  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });