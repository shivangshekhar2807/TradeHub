const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chatSchema = mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  ],

  messages: [messageSchema],
},{timestamps:true});


const chatModel = mongoose.model("chat", chatSchema)

module.exports = chatModel;