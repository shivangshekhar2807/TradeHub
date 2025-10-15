const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    product: {
          type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    readNotification: {
      type: Boolean,
      default: false,
    },

    notification: {
      type: String,
      default: "You dont have any notification",
    },
  },
  { timestamps: true }
);

const notificationModel = new mongoose.model(
  "notification",
  notificationSchema
);


module.exports = notificationModel;