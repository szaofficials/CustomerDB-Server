const jwt = require("jsonwebtoken");
const User = require("../models/userModel");




const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized HTTP, Token not provided or malformed" });
    }

    // console.log("Token from auth middleware with bearer :",token);

    const jwtToken = token.replace("Bearer ", "").trim();

    // console.log("Token from auth middleware:",jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
       

        const userData = await User.findOne({ c_id: isVerified.userID }).
        select({
            password:0,
        });
        // console.log("User data from database:", userData);

        if (!userData) {
            return res
                .status(401)
                .json({ message: "Unauthorized. User not found." });
        }

        req.user = userData;
        req.token = token;
        req.userID = userData.c_id;

        next();
    } catch (error) {
        // console.error("Error in authMiddleware:", error);
        return res
            .status(401)
            .json({ message: "Unauthorized. Invalid Token." });
    }
};

module.exports = authMiddleware;



