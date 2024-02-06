const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// REGISTER USER
const registerUser = asyncHandler(async (req, res, next) => {
    const {username, email, password, preferredGenre} = req.body;
    
    // Mandatory fields check 
    if(!username || !email || !password || !preferredGenre){
        req.response = {
            code: 400,
            message: "All fields are mandatory!",
            data: {}
        };
        return next();
    }

    // Already registered user - email already registered
    const userAvailable = await User.findOne({email});
    if (userAvailable){
        req.response = {
            code: 409,
            message: "Email already registered",
            data: {}
        };
        return next();
    }

    // Already registered user - username already taken
    const userNameAvailable = await User.findOne({username});
    if (userNameAvailable){
        req.response = {
            code: 409,
            message: "Username already taken",
            data: {}
        };
        return next();
    }

    // Hash Password 
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Register user 
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        preferredGenre
    });

    console.log(`User Created ${User}`);
    if(user){
        req.response = {
            code: 201,
            message: "User Created",
            data: {_id: user.id, email: user.email}
        };
        return next();
    }else{
        req.response = {
            code: 400,
            message: "User data not valid",
            data: {}
        };
        return next();
    }
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // Mandatory fields check 
    if (!email || !password) {
        req.response = {
            code: 400,
            message: "All fields are mandatory!",
            data: {}
        };
        return next(); // Move to the next middleware (responseHandler)
    }

    // check credentials - compare password and hashedPassword
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id 
                },
            },//payload to generate the token
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "90h"} //token expiry time
        );

        // Set the response object with the access token
        req.response = {
            code: 200,
            message: "Login successful",
            data: {
                accessToken: accessToken
            },
        };
    }else{
        req.response = {
            code: 401,
            message: "Invalid credentials",
        };
    }
    next(); // Move to the next middleware (responseHandler)

});

// CURRENT USER INFO
const currentUser = asyncHandler(async (req, res, next) => {
    req.response = {
        code: 200,
        message: "Current user information",
        data: req.user
    };
    next();
});

module.exports = {registerUser, loginUser, currentUser};