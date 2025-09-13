
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
    },
    available: {
      type: Boolean,
      required: true,
    },
    user: {
      firstName: { type: String, required: true },
      email: { type: String, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // assumes your User model is named "users"
      required: true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;