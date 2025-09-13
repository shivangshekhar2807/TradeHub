
const mongoose = require('mongoose')

const productDealSchema = mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const productDealModel = mongoose.model("productDeal", productDealSchema);

module.exports = productDealModel;


