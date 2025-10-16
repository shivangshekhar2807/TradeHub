
const express = require('express');
const userAuth = require('../middleware/auth');
const userModel = require('../models/users');
const profileRouter = express.Router();
const {editprofileValidation}=require('../validation/validator');
const productModel = require('../models/products');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        //get the logged in user 
        const { _id } = req.user;

        //check whether logged-in user present in DB or not

        const user = await userModel.findById(_id);
        if (!user) {
            throw new Error("User Not Found")
        }

        //send the user back

        res.status(200).json({
            status: "User profile Found",
            data:user
        })
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
})



profileRouter.get("/profile/:id", userAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById({ _id: id });

        if (!user) {
            throw new error("User not found");
        }

        res.status(200).json({
            datat:user
        })
    }
    catch (err) {
         res.status(400).json({
           ERROR: err.message,
         });
    }
})



profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        //get the logged in user

        const { _id } = req.user;

        const number = req.user.phone
        const City = req.user.city;
        const {phone,city}=req.body

        //validation check for fields to be edited

        if (Object.keys(req.body).length === 0) {
          throw new Error("No fields provided to update");
        }

        editprofileValidation(req.body);



        //check whether logged-in user present in DB or not

        const user = await userModel.findById(_id);

        if (!user) {
             throw new Error("User Not Found");
        }


        
        // update the user fields and store in DB

        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);

        if (phone !== undefined && number !== phone) {
         
             await productModel.updateMany(
               { userId: _id ,status:"unsold"},
               { $set: { contactNo: phone} }
             );
        }

            if (city !== undefined && City !== city) {
              await productModel.updateMany(
                { userId: _id, status: "unsold" },
                { $set: { city} }
              );
            }
        
      

        const newUser = await user.save();

        // send back the updated data

        res.status(200).json({
            status: "Update Successfull",
            data:newUser
        })
    }
    catch (err) {
        res.status(400).json({
          ERROR: err.message,
        });
    }
})

module.exports = profileRouter;