
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
    about: {
      type: String,
      maxLength: 180,
      default: null,
    },
    originalprice: {
      type: Number,
      default: null,
    },
    sellingPrice: {
      type: Number,
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    totalUsed: {
      type: Number,
      default: null,
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