
const express = require('express');
const userAuthRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userModel = require('../models/users');
const {run}=require('../utils/sendEmail')


userAuthRouter.post('/signUp', async (req, res) => {
  try {
    const { phone, password, email, firstName } = req.body;

    //check if email and phone allready present, other move forward

    const credPresent = await userModel.find({
      $or: [
        { phone },
        { email }
      ]
    })

    if (credPresent.length > 0) {
      return res.status(401).json({ ERROR: "Credentials Allready Present" })
    }

    // bcrypt the password

    const hashedPassword = await bcrypt.hash(password, 10);
    

    // save in DB

    const user = new userModel({
      phone,
      password: hashedPassword,
      email,
      firstName,
      walletbalance:100,
    });

    const savedUser = await user.save();

    //create a JWT and put the _id

    const token = await jwt.sign(
      {
        _id: savedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //set JWT in cookie

    res.cookie("Token", token, {
      maxAge: 3600000,
    });

      const emailSes = await run(email,firstName);

      console.log(emailSes);


    //send the res back
    res.status(201).json({
      message: "User Added Successfully",
      user: savedUser,
    });
  }
  catch (err) {
    res.status(401).json({ ERROR: err.message })
  }
});



userAuthRouter.post('/login', async (req, res) => {
  try {
    //destructure email and pasword

    const { email, password } = req.body
    
    // check email in Db

    const emailPresent = await userModel.findOne({ email: email });

    if (!emailPresent) {
      return res.status(401).json({ ERROR: "Invalid Credentials" })
    }

    // verify password with hash

    const correctPassword = await bcrypt.compare(password, emailPresent.password);

    if (!correctPassword) {
      return res.status(401).json({ ERROR: "Invalid Credentials" });
    }

    //create JWT and put _id

    const token = await jwt.sign(
      {
        _id: emailPresent._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // set token in cookie

    res.cookie("Token", token, {
      maxAge: 3600000,
    });

    // return res 

    res.json({
      status: "Login Successfull",
      data: emailPresent,
    });
  }
  catch (err) {
    res.status(401).json({ "ERROR": err.message })
  }
});

userAuthRouter.post('/logout', async (req, res) => {
  res.cookie("Token", null, {
    expires: new Date(Date.now()),
  });
  res.status(201).json({
    status: "LOGOUT SUCCESSFULL",
  });
})



module.exports = userAuthRouter;

