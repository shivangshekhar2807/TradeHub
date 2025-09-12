

const mongoose = require("mongoose");

const connnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shivangshekhar302:ss621311@shivang-dev.qdfs9rq.mongodb.net/TradeHub"
  );
};

module.exports = connnectDB;


