
const mongoose = require('mongoose');


const productDealSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  dealStatus: {
    type: String,
    default: "pending",
    enum: {
      values: ["done", "pending"],
      message: `{VALUE} is incorrect Product deal status type.`,
    },
    },
  
},{timestamps:true});


const productDealModel = mongoose.model("deal", productDealSchema);

module.exports = productDealModel;

