// const { SendEmailCommand } =require( "@aws-sdk/client-ses");
// const { sesClient }= require( "./libs/sesClient.js");

// const createSendEmailCommand = (toAddress, fromAddress) => {
//   return new SendEmailCommand({
//     Destination: {
//       /* required */
//       CcAddresses: [
//         /* more items */
//       ],
//       ToAddresses: [
//         toAddress,
//         /* more To-email addresses */
//       ],
//     },
//     Message: {
//       /* required */
//       Body: {
//         /* required */
//         Html: {
//           Charset: "UTF-8",
//           Data: "HTML_FORMAT_BODY",
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "TEXT_FORMAT_BODY",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: "EMAIL_SUBJECT",
//       },
//     },
//     Source: fromAddress,
//     ReplyToAddresses: [
//       /* more items */
//     ],
//   });
// };

// const run = async () => {
//   const sendEmailCommand = createSendEmailCommand(
//     "shivangshekhar302@gmail.com",
//     "shivang@tradehub.life"
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
     
//       const messageRejectedError = caught;
//       return messageRejectedError;
//     }
//     throw caught;
//   }
// };

// // snippet-end:[ses.JavaScript.email.sendEmailV3]
// module.exports= { run };





const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./libs/sesClient.js");
const {sesClient}=require('./sesClient')

const createSendEmailCommand = (toAddress, fromAddress) => {
  const subject = "Welcome to TradeHub – Your Account is Now Active!";

  const textBody = `
Hello Shivang,

Thank you for joining TradeHub!

Your account has been successfully created. You can now log in and start exploring our platform.

If you have any questions, feel free to reach out to our support team at support@tradehub.life.

Best regards,  
The TradeHub Team
`;

  const htmlBody = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #1a73e8;">Welcome to TradeHub, Shivang!</h2>
        <p style="font-size: 16px; color: #333;">
          We're excited to have you on board. Your account has been successfully created and is now active.
        </p>
        <p style="font-size: 16px; color: #333;">
          You can log in anytime to explore new trading opportunities and connect with buyers and sellers.
        </p>
        <a href="https://tradehub.life/login" 
           style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Log In to TradeHub
        </a>
        <p style="margin-top: 20px; color: #555;">
          Need help? Contact us at <a href="mailto:support@tradehub.life">support@tradehub.life</a>
        </p>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 14px; color: #777;">
          © ${new Date().getFullYear()} TradeHub. All rights reserved.
        </p>
      </div>
    </body>
  </html>
  `;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "shivangshekhar302@gmail.com",
    "shivang@tradehub.life"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught;
    }
    throw caught;
  }
};

module.exports = { run };







// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./sesClient");

// // Accept dynamic "toAddress" and "userName" for personalization
// const createSendEmailCommand = (toAddress, userName, fromAddress) => {
//   const subject = "Welcome to TradeHub – Your Account is Now Active!";

//   const textBody = `
// Hello ${userName || "User"},

// Thank you for joining TradeHub!

// Your account has been successfully created. You can now log in and start exploring our platform.

// If you have any questions, feel free to reach out to our support team at support@tradehub.life.

// Best regards,  
// The TradeHub Team
// `;

//   const htmlBody = `
//   <html>
//     <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
//       <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//         <h2 style="color: #1a73e8;">Welcome to TradeHub${
//           userName ? `, ${userName}` : ""
//         }!</h2>
//         <p style="font-size: 16px; color: #333;">
//           We're excited to have you on board. Your account has been successfully created and is now active.
//         </p>
//         <p style="font-size: 16px; color: #333;">
//           You can log in anytime to explore new trading opportunities and connect with buyers and sellers.
//         </p>
//         <a href="https://tradehub.life/login" 
//            style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
//           Log In to TradeHub
//         </a>
//         <p style="margin-top: 20px; color: #555;">
//           Need help? Contact us at <a href="mailto:support@tradehub.life">support@tradehub.life</a>
//         </p>
//         <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
//         <p style="font-size: 14px; color: #777;">
//           © ${new Date().getFullYear()} TradeHub. All rights reserved.
//         </p>
//       </div>
//     </body>
//   </html>
//   `;

//   return new SendEmailCommand({
//     Destination: {
//       ToAddresses: [toAddress],
//     },
//     Message: {
//       Body: {
//         Html: { Charset: "UTF-8", Data: htmlBody },
//         Text: { Charset: "UTF-8", Data: textBody },
//       },
//       Subject: { Charset: "UTF-8", Data: subject },
//     },
//     Source: fromAddress,
//   });
// };

// // Accept user's email & name dynamically when calling `run`
// const run = async (userEmail, userName) => {
//   const sendEmailCommand = createSendEmailCommand(
//     userEmail,
//     userName,
//     "shivang@tradehub.life"
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
//       return caught;
//     }
//     throw caught;
//   }
// };

// module.exports = { run };