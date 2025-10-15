
const mongoose = require('mongoose');
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
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

    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    city: {
      type: String,
    },

    walletbalance: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Wallet balance cannot be in negative",
      },
    },

    verifyOrderId: {
      type:String
    },

    weekEndOffer: {
      type: Boolean,
      default:false
    },

    weekEndOfferText: {
      type: String,
      default:"Sorry there is no offer going on!!!"
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

//user--> firstName,lastName,productImg[],email,password,phone,about,originalprice,sellingPrice,purchaseDate,totalUsed,productType