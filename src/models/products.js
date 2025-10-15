
const mongoose = require('mongoose');
const validator = require("validator");


const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    contactNo: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // regex for exactly 10 digits
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    productName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      maxLength: 180,
      default: null,
    },
    originalprice: {
      type: Number,
      default: null,
      required: true,
    },
    sellingPrice: {
      type: Number,
      default: null,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: null,
      required: true,
    },
    totalUsed: {
      type: Number,
      default: null,
      required: true,
    },
    productImg: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string");
        },
        message: (props) => `All product images must be valid URLs.`,
      },
    },
    productType: {
      type: String,
      required: true,
      enum: {
        values: ["electronics", "fashion", "daily"],
        message: `{VALUE} is incorrect Product type.`,
      },
    },
    distance: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "unsold",
    },
    currentStatus: {
      type: String,
      default: null,
      enum: {
        values: ["buy"],
        message: `{VALUE} is incorrect Product type.`,
      },
    },
  },
  {
    timestamps: true,
  }
);


const productModel = mongoose.model("product", productSchema);

module.exports = productModel;