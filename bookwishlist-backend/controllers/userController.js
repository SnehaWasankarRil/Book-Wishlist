const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const responseHandler = require("../middleware/responseHandler");

// Register User
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

    // Already registered user - email already taken
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
        // res.status(409);
        // throw new Error("Username already taken");
    }

    // // Check if the preferredGenre is one of the existing values // redununt code
    // const allowedGenres = ['Fiction', 'Non-Fiction', 'Comic', 'Horror'];
    // if (!allowedGenres.includes(preferredGenre)) {
    //     res.status(400);
    //     throw new Error("Invalid preferred genre. \n Please choose from 'Fiction', 'Non-Fiction', 'Comic', 'Horror'.");
    // }

    // Hash Password 
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed Password: ", hashedPassword);
    
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
        // res.status(201).json({_id: user.id, email: user.email});
    }else{
        // ????????????????????
        req.response = {
            code: 400,
            message: "User data not valid",
            data: {}
        };
        return next();
        // res.status(400);
        // throw new Error("User data not valid");
    }
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    
    // // Mandatory fields check 
    // if(!email || !password){
    //     res.status(400);
    //     throw new Error("All fiels are mandatory!");
    // }

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
                accessToken: accessToken,
                // Other data you want to include in the response
            },
        };

        // Call the response middleware
        responseHandler(req, res);
        // res.status(200).json({accessToken}); //old code
    }else{
        // res.status(401);
        // throw new Error("invalid creds!");
        req.response = {
            code: 401,
            message: "Invalid credentials",
            data: {}
        };
    }
    
    next(); // Move to the next middleware (responseHandler)

});

// Current User Info
const currentUser = asyncHandler(async (req, res, next) => {
    req.response = {
        code: 200,
        message: "Current user information",
        data: req.user
    };
    responseHandler(req, res);
    next();
});

module.exports = {registerUser, loginUser, currentUser};