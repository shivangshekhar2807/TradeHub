

// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// // const { sesClient } = require("./libs/sesClient.js");
// const {sesClient}=require('./sesClient')

// const createSendEmailCommand = (toAddress, fromAddress) => {
//   const subject = "Welcome to TradeHub – Your Account is Now Active!";

//   const textBody = `
// Hello Shivang,

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
//         <h2 style="color: #1a73e8;">Welcome to TradeHub, Shivang!</h2>
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
//         Html: {
//           Charset: "UTF-8",
//           Data: htmlBody,
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: textBody,
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: subject,
//       },
//     },
//     Source: fromAddress,
//   });
// };

// const run = async () => {
//   const sendEmailCommand = createSendEmailCommand(
//     "shivangshekhar302@gmail.com",
//     "support@tradehub.life"
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





const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = ({ firstName, phone, amount, status ,email}) => {
  const isSuccess = status === "captured";

  const subject = isSuccess
    ? `TradeHub Payment Receipt – ₹${amount} Received`
    : `TradeHub Payment Failed – ₹${amount}`;

  const textBody = isSuccess
    ? `Hello ${firstName},

Your payment of ₹${amount} has been received successfully.

Details:
Name: ${firstName}
email:${email}
Phone: ${phone}
Amount Paid: ₹${amount}
Status: SUCCESS

The amount has been added to your TradeHub wallet.

Best regards,
The TradeHub Team`
    : `Hello ${firstName},

Your payment of ₹${amount} failed.

Details:
Name: ${firstName}
email:${email}
Phone: ${phone}
Amount: ₹${amount}
Status: FAILED

Please try again or contact support@tradehub.life for help.

Best regards,
The TradeHub Team`;

  const htmlBody = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: ${
          isSuccess ? "#16a34a" : "#dc2626"
        }; margin-bottom: 15px;">
          ${isSuccess ? "✅ Payment Successful" : "❌ Payment Failed"}
        </h2>
        <p style="font-size: 16px; color: #333;">Hello <strong>Shivang</strong>,</p>
        <p style="font-size: 15px; color: #444;">
          ${
            isSuccess
              ? `We’ve received the payment of <strong>₹${amount}</strong> successfully from ${firstName}.`
              : `Your payment attempt of <strong>₹${amount}</strong> was unsuccessful.`
          }
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;">Name</td>
            <td style="padding: 8px; border: 1px solid #eee;">${firstName}</td>
          </tr>
           <tr>
            <td style="padding: 8px; border: 1px solid #eee;">Name</td>
            <td style="padding: 8px; border: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;">Phone</td>
            <td style="padding: 8px; border: 1px solid #eee;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;">Amount</td>
            <td style="padding: 8px; border: 1px solid #eee;">₹${amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee;">Status</td>
            <td style="padding: 8px; border: 1px solid #eee; color: ${
              isSuccess ? "#16a34a" : "#dc2626"
            };">${isSuccess ? "SUCCESS" : "FAILED"}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #333;">
          ${
            isSuccess
              ? "The amount has been credited to your wallet."
              : "Please retry your payment or contact our support team."
          }
        </p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 13px; color: #777;">© ${new Date().getFullYear()} TradeHub. All rights reserved.</p>
      </div>
    </body>
  </html>`;

  return new SendEmailCommand({
    Destination: {
      ToAddresses: ["shivangshekhar302@gmail.com"], // fixed toAddress
    },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: htmlBody },
        Text: { Charset: "UTF-8", Data: textBody },
      },
      Subject: { Charset: "UTF-8", Data: subject },
    },
    Source: "support@tradehub.life", // fixed fromAddress
  });
};

const run = async (paymentDetails) => {
  const sendEmailCommand = createSendEmailCommand(paymentDetails);

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log("✅ Payment email sent:", result.MessageId);
    return result;
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      console.error("❌ Message Rejected:", caught.message);
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