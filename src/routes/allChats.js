const express = require('express');
const userAuth = require('../middleware/auth');
const chatModel = require('../models/chat');
const chatRouter = express.Router();


chatRouter.get("/user/chats/:id", userAuth, async (req, res) => {
    try {

        const { id } = req.params;
        
        const arr = id.toString().split("_");

        const senderId = arr[0];
        const receiverId = arr[1];

        let chats = await chatModel.findOne({
          participants: { $all: [senderId, receiverId] },
        });

          if (!chats) {
            chats = new chatModel({
              participants: [senderId, receiverId],
              messages: [],
            });
          }
       
        res.status(200).json({
            results:chats
        })
    }
    catch (err) {
        res.status(400).json({
            ERROR:err.message
        })
    }
})

module.exports = chatRouter;