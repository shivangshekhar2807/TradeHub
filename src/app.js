
const express = require('express');
const app = express();
const connectDB = require('./DBconfig/database')
const cookieParser = require("cookie-parser");
const userModel = require('./models/users')
const authRouter = require('./routes/auth')
const userProductRouter=require('./routes/userProduct');
const productRouter = require('./routes/product');
const userProfileRouter = require('./routes/userProfile');
const productDealRouter = require('./routes/productDeal');

app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    console.log("DataBase Connected")
    app.listen(3333, () => {
        console.log("server started !!!!")
    })
})


app.use('/', authRouter)
app.use("/", userProductRouter);
app.use('/', productRouter)
app.use('/', userProfileRouter)
app.use('/',productDealRouter)

