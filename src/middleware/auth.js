const jwt = require('jsonwebtoken')
const userModel=require('../models/users')
const userAuth = async (req, res, next) => {
    try {
        const { Token } = req.cookies;

        if (!Token) {
            return res.status(401).json({
                status:"Unauthorized"
            })
        }

        const decoded = await jwt.verify(Token, process.env.JWT_SECRET);

        const {_id}=decoded

        const user = await userModel.findById({ _id: _id });

        if (!user) {
            return res.status(401).json({
                status:"User not found"
            })
        }

        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({
             "ERROR": err.message
         });
    }
    
}

module.exports = userAuth;