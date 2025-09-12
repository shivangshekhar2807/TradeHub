const express = require('express');
const app = express();
const authRouter = express.Router();
const userModel = require('../models/users')
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());

authRouter.post('/signUp', async (req, res) => {
    try {
        const { firstName, password, email } = req.body;

        if (!firstName || !password || !email) {
            throw new Error("All Fields Not provided")
        }

        const emailPresent = await userModel.findOne({ email })
        
        if (emailPresent) {
            throw new Error("User Already Exist")
        }

        const user =  new userModel({ firstName, password, email });

        const resp = await user.save();

        const token = await jwt.sign({
            id:resp._id
        },
            "shivangshekhar2807"
        )

        res.cookie("token", token)
        
        res.json({
          status: "User created successfully",
          result: resp,
        });


    }
    catch (err) {
        res.status(400).send("ERROR"+err)
    }
})


authRouter.post('/login', async (req, res) => {
    
    try {
        const { email, password } = req.body;

        const emailPresent = await userModel.findOne({ email });
        if (!emailPresent) {
            throw new Error("Wrong Credential")
        }

        if (emailPresent.password != password) {
             throw new Error("Wrong Credential");
        }

        const token = await jwt.sign(
          { id: emailPresent._id },
          "shivangshekhar2807"
        );

        res.cookie("token", token);

        res.send("Login Successfull")
    }
    catch (err) {
        res.status(400).send({ error: err.message });
    }


})


authRouter.post('/logout', async (req, res) => {
     res.cookie("token", null, {
       expires: new Date(Date.now()),
     });
     res.send("LOGOUT SUCCESSFULL");
})


module.exports = authRouter;

   
  
