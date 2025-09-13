
const express = require('express');
const userAuth = require('../middleware/auth');
const productDealRouter = express.Router();


productDealRouter.post('/user/product/deal', userAuth, async (req, res) => {
    
})

module.exports = productDealRouter;