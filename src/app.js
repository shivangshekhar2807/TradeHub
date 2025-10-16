const express = require('express');
const app = express();
require("dotenv").config();
const connectDb = require('./DBconfig/database')
require('./utils/weekEndCron')
const http=require('http')



const cors = require("cors");
const cookieparser = require("cookie-parser");
const userAuthRouter=require('./routes/userAuth');
const profileRouter = require('./routes/profile');
const userProductRouter = require('./routes/userProducts');
const feedproductsRouter = require('./routes/feedProducts');
const productDealRouter = require('./routes/productsDeal');
const productReviewRouter = require('./routes/productReview');
const paymentRouter = require('./routes/payment');
const notificationRouter = require('./routes/notification');
const offerRouter = require('./routes/weeklyOffer');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/allChats');


const server = http.createServer(app)
initializeSocket(server);

connectDb().then(() => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
    server.listen(7777, () => {
      console.log("backened started and server listening on port 7777");
    });
}).catch((err) => {
    console.log(err)
})


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieparser());


app.use("/", userAuthRouter);
app.use("/", profileRouter);

app.use("/", userProductRouter);
app.use("/", feedproductsRouter)
app.use("/", productDealRouter);
app.use("/", productReviewRouter);
app.use("/", paymentRouter);
app.use("/", notificationRouter);
app.use("/", offerRouter);
app.use("/",chatRouter)




