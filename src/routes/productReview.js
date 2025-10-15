const express = require('express');
const userAuth = require('../middleware/auth');
const productDealModel = require('../models/productDeal');
const productModel = require('../models/products');
const userModel = require('../models/users');
const productReviewRouter = express.Router();

const BUYER_SELLER_DATA = "firstName lastName city phone";
const PRODUCT_DATA =
  "contactNo originalprice sellingPrice productImg city status productType productName";
  


productReviewRouter.post("/user/Product/deal/Review", userAuth, async (req, res) => {
    try {

        const { productId, buyerId ,dealId,} = req.body;

        //get the productId to check whether product present or not and status is unsold
        
        const productDetail = await productModel.findOne({
            _id: productId,
            status:"unsold"
        });

        if (!productDetail) {
           throw new Error("Cannot sell this product.")
        }

     

        //get buyerId to check whether buyer available or not

        const buyer = await userModel.findById({ _id: buyerId });

        if (!buyer) {
            throw new Error("You cannot sell this product to the Buyer, because is not available")
        }

        //get the productDeal Id to check dealStatus as pending

        const CurrentDealStatus = await productDealModel.findOne({
          _id: dealId,
          dealStatus:"pending"
        });

        if (!CurrentDealStatus) {
          throw new Error("This deal has allready been made.");
        }

       
        

        //make the dealStatus as done with productDeal Id

        CurrentDealStatus.dealStatus = "done";

        const doneDeal = await CurrentDealStatus.save();

        

        //make the product status as sold through productId in the product model

        productDetail.status = "sold"

        const productStatus = await productDetail.save();
        
        res.status(201).json({
          status: "Deal done",
          dealData: doneDeal,
          productData: productStatus,
        });



        
    }
    catch (err) {
         res.status(400).json({
           ERROR: err.message,
         });
    }
});


productReviewRouter.get("/user/Product/deal/Review", userAuth, async (req, res) => {
    try {
        // get the _id as sellerId

        const { _id } = req.user;

          const page = parseInt(req.query.page) || 1;
          let limit = parseInt(req.query.limit) || 10;
          limit = limit > 50 ? 50 : limit;
          const skip = (page - 1) * limit;


        //get the dealData from sellerId and status as pending

        const dealProduct = await productDealModel
          .find({
            sellerId: _id,
            dealStatus: "pending",
          })
          .skip(skip)
          .limit(limit)
          .populate("buyerId", BUYER_SELLER_DATA)
          .populate("sellerId", BUYER_SELLER_DATA)
            .populate("productId", PRODUCT_DATA);
        
         


        res.status(200).json({
            count: dealProduct.length,
            results:dealProduct
        })

        //
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
});


module.exports = productReviewRouter;