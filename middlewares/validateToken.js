const jwt = require("jsonwebtoken");
require("dotenv").config();




const validateToken = (req, res, next) => {
    const { access_token } = req.cookies;
    // console.log("access_token: ", access_token);

    if(!access_token) return res.status(401).json({message: "Authorization denied! No token!"});

    //if verified, it'll return the payload of the token, which is the user's information
    const user = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
};



module.exports = { validateToken };