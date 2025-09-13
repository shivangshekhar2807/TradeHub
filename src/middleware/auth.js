const jwt = require('jsonwebtoken');
const userModel = require('../models/users')

const userAuth = async (req,res,next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token Not Present")
        }

        const decoded = await jwt.verify(token, "shivangshekhar2807");

        const { _id } = decoded;

        const present = await userModel.findById(_id);

        if (!present) {
            throw new Error("User not found")
        }
        req.user = present;
        next();
    }
    catch (err) {
        res.status(400).send(err.message)
    }

}

module.exports = userAuth;

