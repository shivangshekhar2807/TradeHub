const express = require('express');
const userProductRouter = express.Router();
const productModel = require('../models/products');
const userAuth = require('../middleware/auth');
const Validator=require('../validation/validator')



userProductRouter.post('/user/product',userAuth, async (req, res) => {
    try {
        const { firstName, email, _id } = req.user;
        const { productName, price, images, description, available } = req.body;

        const validate = Validator(
          productName,
          price,
          images,
          available
        );

         if (!validate.success) {
           return res.status(400).json({ error: validate.error });
         }
        
        const payload = {
          user: {
            firstName,
            email,
            _id,
          },
          productName,
          price,
          images,
          description,
          available,
          user_id:_id
        };

       const product = new productModel(payload);
        const savedProduct =await product.save();


        res.json({
          status: "Product Saved successfully",
          results: savedProduct,
        });
        


    }
    catch (err) {
        res.status(400).send(err.message)
    }
})


userProductRouter.get('/user/product', userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
       

        const products = await productModel.find({ user_id: _id });
        res.json({
          status: "success",
          results: products,
        });
        
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})



userProductRouter.get("/user/product/:id", userAuth, async (req, res) => {
  try {
      const specificId = req.params.id;
       const userId = req.user._id;

    // Correct usage: pass just the ID
    const product = await productModel.findOne({
      _id: specificId,
      user_id: userId,
    });


    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      status: "success",
      results: product,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});


userProductRouter.patch('/user/product/:id', userAuth, async (req, res) => {

    try{
 

  const { _id } = req.user;

 

  const paramid = req.params.id;

 

  const product = await productModel.findById(paramid);

  if (!product) {
    return res.status(400).send("Product Not Present");
  }

  

  const userId = product.user_id;

 

  if (String(userId) != String(_id)) {
    return res.status(400).send("Cannot Edit Other User products");
  }

  

  const allowed = [
    "productName",
    "price",
    "images",
    "description",
    "available",
  ];

  const updates = Object.keys(req.body);


  const isValidOperation = updates.every((field) => allowed.includes(field));
  if (!isValidOperation) {
    return res.status(400).send("Invalid updates!");
  }


  updates.forEach((field) => {
    if (field === "images" && Array.isArray(req.body.images)) {
     
      product.images = req.body.images;
    } else {
      product[field] = req.body[field];
    }
  });
    
    await product.save();
    
     res.json({
       message: "Product updated successfully",
       product,
     });
     } catch (err) {
    res.status(400).send(err.message);
  }
    
})


module.exports = userProductRouter;

