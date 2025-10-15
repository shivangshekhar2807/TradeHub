const express = require("express");
const userAuth = require("../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const orderPaymentModel = require("../models/orderPayment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const userModel = require("../models/users");
const { run: sendPaymentEmail } = require("../utils/sendEmail");
const { getDayAndTime } = require("../validation/validator");

paymentRouter.post("/payment/create/orderId", userAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const { firstName, email, phone, city, _id } = req.user;

    const orderId = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",

      notes: {
        firstName,
        email,
        phone,
        city,
      },
    });

    console.log(orderId);

    const finalOrderId = new orderPaymentModel({
      user: _id,
      orderId: orderId.id, // Razorpay order ID
      amount: orderId.amount, // total amount
      amount_paid: orderId.amount_paid, // from razorpay response
      attempts: orderId.attempts, // from razorpay response
      created_at: orderId.created_at, // from razorpay response (epoch)
      currency: orderId.currency,

      status: orderId.status, // usually "created"
      notes: {
        firstName: orderId.notes.firstName,
        email: orderId.notes.email,
        phone: orderId.notes.phone,
        city: orderId.notes.city,
      },
    });

    const savedOrderId = await finalOrderId.save();

    console.log("orderId", savedOrderId);

    res.json({
      data: orderId,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(400).json({
      ERROR: err.message,
    });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("webhookSignature", webhookSignature);
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    console.log("isWebhookValid", isWebhookValid);

    if (!isWebhookValid) {
      return res.status(400).json({ ERROR: "Webhook signature is invalid" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await orderPaymentModel.findOne({
      orderId: paymentDetails.order_id,
    });

    payment.status = paymentDetails.status;

    await payment.save();

    // if (paymentDetails.status == "captured") {

    //       const user = await userModel.findById({
    //         _id: payment.user,
    //       });

    //       let oldBalance = user.walletbalance;

    //       let amount = paymentDetails.amount / 100;

    //       let newBalance = oldBalance + amount;

    //       user.walletbalance = newBalance;
    //       user.verifyOrderId = paymentDetails.order_id;

    //       await user.save();
    // }

    console.log("payment", payment);

    const user = await userModel.findById(payment.user);

    if (!user) {
      return res.status(404).json({ ERROR: "User not found" });
    }

    const valid =await getDayAndTime(payment.createdAt);

   

    const amount = paymentDetails.amount / 100;

    if (paymentDetails.status === "captured") {
      if (valid && amount >= 500) {
        user.walletbalance += amount + 100;
        user.verifyOrderId = paymentDetails.order_id;
        await user.save();
      } else {
        user.walletbalance += amount;
        user.verifyOrderId = paymentDetails.order_id;
        await user.save();
      }
    }

    // 🔹 Send SES email notification (success or failed)
    await sendPaymentEmail({
      email: user.email,
      firstName: user.firstName,
      phone: user.phone,
      amount,
      status: paymentDetails.status,
    });

    return res.status(200).json({ message: "Webhooh recieved successfully" });
  } catch (err) {
    return res.status(400).json({ ERROR: err.emssage });
  }
});

paymentRouter.get("/recharge/verify", userAuth, async (req, res) => {
  const { _id, verifyOrderId, walletbalance } = req.user;

  const verify = await findOne({
    user: _id,
    orderId: verifyOrderId,
  });

  if (!verify) {
    return res.status(400).json({ status: "Failed" });
  }
  return res.json({
    status: "Successfull",
    amount: walletbalance,
  });
});

module.exports = paymentRouter;

// {
//   "entity": "event",
//   "account_id": "acc_F6wqJ2nP7rR9Jv",
//   "event": "payment.captured",
//   "contains": ["payment"],
//   "payload": {
//     "payment": {
//       "entity": {
//         "id": "pay_F7mY9hYd3X8XkI",
//         "entity": "payment",
//         "amount": 50000,
//         "currency": "INR",
//         "status": "captured",
//         "order_id": "order_F7mWf5fYZP9BKn",
//         "invoice_id": null,
//         "international": false,
//         "method": "upi",
//         "amount_refunded": 0,
//         "refund_status": null,
//         "captured": true,
//         "description": null,
//         "card_id": null,
//         "bank": null,
//         "wallet": null,
//         "vpa": "test@razorpay",
//         "email": "customer@example.com",
//         "contact": "+919999999999",
//         "notes": {
//           "firstName": "Shivang",
//           "email": "shivang@example.com",
//           "phone": "9999999999",
//           "city": "Patna"
//         },
//         "fee": 1180,
//         "tax": 180,
//         "error_code": null,
//         "error_description": null,
//         "created_at": 1739587020
//       }
//     }
//   },
//   "created_at": 1739587020
// }
