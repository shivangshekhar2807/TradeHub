
const express = require('express');
const userAuth = require('../middleware/auth');
const UserModel = require('../models/users');

const userProfileRouter = express.Router();

userProfileRouter.get('/user/profile', userAuth, async (req, res) => {
    try {
        const { _id } = req.user;

        const user = await UserModel.findById(_id).select("-password");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            result:user
        })
    }
    catch (err) {
        res.status(400).send(err.message)
    }


})


userProfileRouter.patch('/user/profile/:id', userAuth, async (req, res) => {

    try {
      const { _id } = req.user;

      const editId = req.params.id;

      const { firstName, password } = req.body;

      if (String(_id) != String(editId)) {
        return res.status(400).send("You Cannot Edit Other Uer Details");
      }

      const allowed = [ "password"];

      const updates = Object.keys(req.body);

      const isValidOperation = updates.every((key) => allowed.includes(key));

      if (!isValidOperation) {
        return res.status(400).send("Invalid fields in update request");
      }

      const updateuser = await UserModel.findByIdAndUpdate(editId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updateuser) {
        return res.status(404).send("User not found");
      }

      res.json({ result: updateuser });
    } catch (err) {
      res.status(400).send(err.message);
    }


})



module.exports = userProfileRouter;
