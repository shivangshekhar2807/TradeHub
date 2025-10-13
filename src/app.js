const express = require('express');
const app = express();
require("dotenv").config();
const connectDb = require('./DBconfig/database')
const cors = require("cors");
const cookieparser = require("cookie-parser");
const userAuthRouter=require('./routes/userAuth');
const profileRouter = require('./routes/profile');
const userProductRouter = require('./routes/userProducts');
const feedproductsRouter = require('./routes/feedProducts');
const productDealRouter = require('./routes/productsDeal');
const productReviewRouter = require('./routes/productReview');


connectDb().then(() => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
    app.listen(7777, () => {
        console.log("backened started and server listening on port 7777")
    })
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





