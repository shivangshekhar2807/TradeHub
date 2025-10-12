const express = require("express");
const userAuth = require("../middleware/auth");
const productModel = require("../models/products");
const { productDistance } = require("../../utils/distance");
const feedproductsRouter = express.Router();

feedproductsRouter.get("/products", userAuth, async (req, res) => {
    try {

        //get users id

        const { _id,city } = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        //exclude - loggedin user products, sold products, currentStatus-buy

        const products = await productModel.find({
        $and:[
              { userId: { $ne: _id } },
            { status: { $ne: "sold" } },
                { currentStatus: { $ne: "buy" } },
        ]
        }).skip(skip).limit(limit);

        //return the products
        
        const finalProducts =await productDistance(products, 0, city);
        


       
        res.status(200).json({
          count: finalProducts.length,
          results: finalProducts,
        });
        
    }
    catch (err) {
         res.status(400).json({
           ERROR: err.message,
         });
    }
});


module.exports = feedproductsRouter;