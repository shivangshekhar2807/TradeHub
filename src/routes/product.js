
const express = require('express');
const userAuth = require('../middleware/auth');
const productModel = require('../models/products');
const productRouter = express.Router();

productRouter.get('/products', userAuth, async (req, res) => {
    try {
        const { _id } = req.user;


         const onlyProducts = await productModel.find({
           user_id: { $ne: _id },
         });

        res.json({
          results: onlyProducts,
        });
        

    }
    catch (err) {
        res.status(400).send(err.message)
    }
    

})


productRouter.get('/products/:id', userAuth, async (req, res) => {
    
    try {
      const prodId = req.params.id;

      const { _id } = req.user;

      const specificProd = await productModel.findById(prodId);

      if (!specificProd) {
        return res.status(404).json({ error: "Product Not Present" });
      }

      // Prevent access if the product belongs to the logged-in user
      if (String(specificProd.user_id) === String(_id)) {
        return res.status(403).json({ error: "Not Accessible" });
      }

      res.json({
        result: specificProd,
      });
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = productRouter;