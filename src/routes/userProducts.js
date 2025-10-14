const express = require('express');
const userAuth = require('../middleware/auth');
const userProductRouter = express.Router();
const {postUserProductValidation, editUserProductValidation}=require('../validation/validator');
const userModel = require('../models/users');
const productModel = require('../models/products');

userProductRouter.post("/user/product", userAuth, async (req, res) => {
    try {
      // get the logged in user id and phone

        const { _id, phone, city } = req.user;
        
    

      //postUserProductValidation for right fields

        postUserProductValidation(req.body);
        
        const {
          about,
          originalprice,
          sellingPrice,
          purchaseDate,
          totalUsed,
          productImg,
          productType,
          
        } = req.body;

      //check user present in Db or not

      const user = await userModel.findById(_id);

      if (!user) {
        throw new Error("Product cannot be added , as user is not present.");
      }
        
        //check balance

        if (user.walletbalance < 10) {
            throw new Error("Sorry you cannot add more products because your wallet balance is low. Please recharge!!!")
        }

      //make a new product model and explicitly put contact as phone and _id as userId

        const product = new productModel({
          about,
          originalprice,
          sellingPrice,
          purchaseDate,
          totalUsed,
          productImg,
          productType,
          contactNo: phone,
          userId:_id,
          city:city
        });

        //save the product in DB

        const newBallance = user.walletbalance - 10;

        user.walletbalance = newBallance;

        await user.save();
        
        const savedProduct = await product.save();

        res.status(201).json({
          status: "Product created successfully",
          data: savedProduct,
        });
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
});


userProductRouter.get("/user/products/", userAuth, async (req, res) => {
    try {

        //get users id

        const { _id } = req.user;

        //check status for validations and filter

        const allowedStatus = ["sold", "unsold", "all"];

        const { status } = req.query;

        if (!allowedStatus.includes(status)) {
            throw new Error("Cannot get products for invalid status type");
        }

        //get the products according to status

        let products;

        if (status == "sold" || status == "unsold") {
            products = await productModel.find({
                userId: _id,
                status,
            })
        }

        if (status == "all") {
             products = await productModel.find({
               userId: _id,
             });
        }

        //return product

        res.status(200).json({
          count: products.length,
          results: products,
        });
        
    }
    catch (err) {
          res.status(400).json({
            ERROR: err.message,
          });
    }
});

userProductRouter.get("/user/product/:id", userAuth, async (req, res) => {
    try {
        //get id from req.params

        const { id } = req.params;

        //check if product is present in Db

        const product = await productModel.findById({ _id: id });

        if (!product) {
            throw new Error("This Product is not available")
        }

        //return product
        res.status(200).json({
            data:product
        })
    }
    catch (err) {
         res.status(400).json({
           ERROR: err.message,
         });
    }
});


userProductRouter.patch("/user/product/:id", userAuth, async (req, res) => {
    try {
        // get the id from params of product

        const { id } = req.params;

        //check if product present or not

        const product = await productModel.findById({ _id: id });

        if (!product) {
            throw new Error("Product not available")
        }

        // validation check
        editUserProductValidation(req.body);

        // check status of product ,to allow edit

        const status = product.status;

        if (status == "sold") {
            throw new Error("Cannot edit sold Products")
        }

        //update the values and save

        Object.keys(req.body).forEach((key) => product[key] = req.body[key]);

        const newProduct = await product.save();

        res.status(200).json({
            status: "Product Updated successfully",
            data:newProduct
        })


    }
    catch (err) {
          res.status(400).json({
            ERROR: err.message,
          });
    }
});


userProductRouter.patch("/user/products/number/edit", userAuth, async (req, res) => {
    try {
        // get the logged in user id and phone
        
        const { _id, phone } = req.user;
      
        //check user present in Db or not
         const user = await userModel.findById(_id);

         if (!user) {
           throw new Error("Contact cannot be Changed , as user is not present.");
         }
      
        //Make a query in DB and update all contacts with the userId

        const newContact = await productModel.updateMany(
          { userId: _id },
          { $set: { contactNo:phone} }
        );

        

        res.status(200).json({
          status: "Contact updated successfully",
          data: newContact,
        });
        

    }
    catch (err) {
        res.status(400).json({
          ERROR: err.message,
        });
    }
});

module.exports = userProductRouter;


