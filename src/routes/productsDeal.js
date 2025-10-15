const express = require('express');
const userAuth = require('../middleware/auth');
const productModel = require('../models/products');
const userModel = require('../models/users');
const productDealModel = require('../models/productDeal');
const productDealRouter = express.Router();
const {run}=require('../utils/sendEmail');
const notificationModel = require('../models/notification');

const BUYER_SELLER_DATA = "firstName lastName city phone";
const PRODUCT_DATA =
  "contactNo originalprice sellingPrice productImg city status";

productDealRouter.post("/user/products/deals", userAuth, async (req, res) => {
    try {
      const { sellerId, productId } = req.body;
      const { _id } = req.user;
      
      const buyerId=await userModel.findById(_id)
       

      // check if the product present or not and in unsold state

      const product = await productModel.findOne({
        _id: productId,
        status: "unsold",
      });

        if (!product) {
        throw new Error("This product is no longer available")
        }
        
        //check if deal has been allready made or not

        const dealMade = await productDealModel.findOne({
          productId,
          sellerId,
          buyerId: _id,
        });

        if (dealMade) {
            throw new Error(
              `You have allready made a deal and the product is in ${dealMade.dealStatus} status`
            );
        }

        //check if the sellerId present or not
        
        const seller = await userModel.findById({ _id: sellerId })
        
        if (!seller) {
            throw new Error("You cannot buy this product because seller is not available")
        }

        //save the deal


        
        const createDeal = new productDealModel({
          sellerId,
          productId,
          buyerId:_id
        });

        const deal = await createDeal.save();

    const productCurrentStatus = await productModel.findOneAndUpdate(
      { _id: productId },
      { $set: { currentStatus: "buy" } },
      { new: true }
    );
        
        
        
      
        const dealNotification = new notificationModel({
          seller: sellerId,
          product: productId,
          buyer: buyerId,
          notification: `Hi ${seller.firstName}, you have got a buyer called ${buyerId.firstName} for your product ${productCurrentStatus.productName} to buy. Kindly check!!`,
        });


        await dealNotification.save();

        res.status(201).json({
            status: "Product is in buy state",
            data:deal
        })
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
});


productDealRouter.get("/user/products/deals", userAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const { _id } = req.user;

         const page = parseInt(req.query.page) || 1;
         let limit = parseInt(req.query.limit) || 10;
         limit = limit > 50 ? 50 : limit;
         const skip = (page - 1) * limit;

        //check status validation

        const isAllowed = ["done", "pending","all"];

        if (!isAllowed.includes(status)) {
            throw new Error("Wrong Status type")
        }

        // put filter and populate fields
        let othersProducts;
        if (status == "done" || status == "pending") {
             othersProducts = await productDealModel
               .find({
                 buyerId: _id,
                 dealStatus: status,
               })
               .skip(skip)
               .limit(limit)
               .populate("buyerId", BUYER_SELLER_DATA)
               .populate("sellerId", BUYER_SELLER_DATA)
               .populate("productId", PRODUCT_DATA);
        }

        if (status == "all") {
              othersProducts = await productDealModel
                .find({
                  buyerId: _id,
                })
                .skip(skip)
                .limit(limit)
                .populate("buyerId", BUYER_SELLER_DATA)
                .populate("sellerId", BUYER_SELLER_DATA)
                .populate("productId", PRODUCT_DATA);
        }

      

        

        res.status(200).json({
          results: othersProducts,
        });

        

    }
    catch (err) {
      res.status(400).json({
        ERROR: err.message,
      });
    }
});

module.exports = productDealRouter;