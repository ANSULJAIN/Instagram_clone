const { default: mongoose } = require("mongoose");
const { JWT_SECRET } = require("../keys");
const jwt = require("jsonwebtoken");
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers; // Correct property name

    if (!authorization) {
        return res.status(401).json({ error: "Please log in" });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You are not authorized for this" });
        }

        // You can access the user ID (_id) from the payload
        const { _id } = payload;

        // Attach user ID to the request object for future use
        req.userId = _id;
        User.findById(_id).then(userdata=>{
            req.user= userdata ;
            next();
        })
        
        // Call next() to proceed to the next middleware or route handler
    });
};
