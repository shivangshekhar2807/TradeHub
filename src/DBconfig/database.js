

const mongoose = require("mongoose");

const connnectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = connnectDB;


