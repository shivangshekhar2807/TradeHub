const cron = require('node-cron');
const userModel = require('../models/users');

cron.schedule("* * * * *", async () => {
  try {
    const offer = await userModel.updateMany(
      {},
      {
        $set: {
          weekEndOffer: true,
          weekEndOfferText:"On a recharge of 500 or above get extra 100 ruppes free in wallet!!!"
        },
      }
    );

    if (!offer) {
      throw new Error("Weekend Cron was not scheduled");
    }

    console.log("Start weekened");
  } catch (err) {
    console.log(err.message);
  }
});



// cron.schedule("*/2 * * * *", async () => {
//   try {
//     const offer = await userModel.updateMany(
//       {},
//       {
//         $set: { offer: false },
//       }
//     );

//     if (!offer) {
//       throw new Error("Weekend Cron was not scheduled");
//     }

//     console.log("stop weekened");
//   } catch (err) {
//     console.log(err.message);
//   }
// });



