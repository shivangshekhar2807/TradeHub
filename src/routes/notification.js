
const express = require('express');
const userAuth = require('../middleware/auth');
const userModel = require('../models/users');
const notificationModel = require('../models/notification');
const notificationRouter = express.Router();

const BUYER_SELLER_DATA = "firstName lastName city phone";
const PRODUCT_DATA =
  "contactNo originalprice sellingPrice productImg city status";

notificationRouter.get("/user/notification", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;

        //check user present or not

        const user = await userModel.findById(_id);

        if (!user) {
            throw new Error("user not found")
        }

        //get all the true notification with _id and sort them

        const notification = await notificationModel
          .find({
            seller: _id,
            readNotification: false,
          })
          .sort({ timestamps: 1 })
          .populate("buyer", BUYER_SELLER_DATA)
          .populate("seller", BUYER_SELLER_DATA)
          .populate("product", PRODUCT_DATA);
            

        //return notification

        res.status(200).json({
          count: notification.length,
          results: notification,
        });
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
})


notificationRouter.patch("/user/notification/:id", userAuth, async (req, res) => {
    try {
        const _id = req.params.id;
        

        const notification = await notificationModel.findById(_id);

        if (!notification || notification.readNotification==true) {
          throw new Error("You cannot edit this notification");
        }

        notification.readNotification = true;

        const newNotification = await notification.save();

        res.status(200).json({
          status: "Updated",
          data: newNotification,
        });



    }
    catch (err) {
          res.status(400).json({
            ERROR: err.message,
          });
    }
});


module.exports = notificationRouter;