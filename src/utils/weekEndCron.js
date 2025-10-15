// const cron = require('node-cron');
// const userModel = require('../models/users');

// cron.schedule("0 12 * * *", async () => {
//   try {
//     const offer = await userModel.updateMany(
//       {},
//       {
//         $set: {
//           weekEndOffer: true,
//           weekEndOfferText:
//             "On a recharge of 500 or above get extra 100 ruppes free in wallet!!!",
//         },
//       }
//     );

//     if (!offer) {
//       throw new Error("Weekend Cron was not scheduled");
//     }

//     console.log("Start weekened");
//   } catch (err) {
//     console.log(err.message);
//   }
// });







const cron = require("node-cron");
const userModel = require("../models/users");


cron.schedule(
  "0 12 * * *",
  async () => {
    try {
      const offer = await userModel.updateMany(
        {},
        {
          $set: {
            weekEndOffer: true,
            weekEndOfferText:
              "On a recharge of ₹500 or above, get extra ₹100 free in your wallet!",
          },
        }
      );

      console.log(" Offer activated at 12:00 PM IST");
    } catch (err) {
      console.error(" Cron 12PM Error:", err.message);
    }
  },
  { timezone: "Asia/Kolkata" }
);



cron.schedule(
  "0 13 * * *",
  async () => {
    try {
      const offer = await userModel.updateMany(
        {},
        {
          $set: {
            weekEndOffer: false,
            weekEndOfferText: "Sorry there is no offer going on!!!",
          },
        }
      );

      console.log(" Offer deactivated at 1:00 PM IST");
    } catch (err) {
      console.error(" Cron 1PM Error:", err.message);
    }
  },
  { timezone: "Asia/Kolkata" }
);
