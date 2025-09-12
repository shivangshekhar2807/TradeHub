
const express = require('express');
const app = express();
const connectDB = require('./DBconfig/database')
const userModel = require('./models/users')
const authRouter=require('./routes/auth')

app.use(express.json());

connectDB().then(() => {
    console.log("DataBase Connected")
    app.listen(3333, () => {
        console.log("server started !!!!")
    })
})


app.use('/',authRouter)
