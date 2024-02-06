const asyncHandler = require ("express-async-handler");
const Book = require("../models/wishlistModel");

// GET ALL BOOKS
const getAllBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find({user_id: req.user.id});
    req.response = {
        code: 200,
        message: "Here is the wishlist!",
        data: {books}
    };
    return next();
});

// ADD ONE BOOK
const addBook = asyncHandler(async (req, res, next) => {
    console.log("The request body is:", req.body);
    const {bookTitle, bookDescription, genre, completionStatus} = req.body;
    if(!bookTitle || !bookDescription || !genre || !completionStatus){
        req.response = {
            code: 400,
            message: "All fields are mandatory!",
            data: {}
        };
        return next();
    }
    const book = await Book.create({
        bookTitle,
        bookDescription,
        genre,
        completionStatus,
        user_id: req.user.id
    });
    req.response = {
        code: 201,
        message: "Book added successfully!",
        data: {book}
    };
    return next();
});

// FIND BOOK BY ID
const findBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        req.response = {
            code: 404,
            message: "Book not found in the wishlist!",
        };
        return next();
    }

    const userAuthenticationCheck = await Book.findOne({ _id: req.params.id, user_id: req.user.id });
    if(!userAuthenticationCheck){
        req.response = {
            code: 403,
            message: "User is not authenticated to view this book",
        };
        return next();
    }
    req.response = {
        code: 200,
        message: "Book found!",
        data: {book}
    };
    return next();
});

// UPDATE BOOK BY ID
const updateBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        req.response = {
            code: 404,
            message: "Book not found!",
        };
        return next();
    }

    // Only the authorized user can update the books added by him
    if(book.user_id.toString() !== req.user.id) {
        req.response = {
            code: 403,
            message: "User don't have the permission to update other user's wishlist",
        };
        return next();
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    req.response = {
        code: 200,
        message: "Here are the updated book details",
        data: {updatedBook}
    };
    return next();
});

const removeBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        req.response = {
            code: 404,
            message: "Book not found!",
        };
        return next();
    }

    // Only the authorized user can delete the books added by him
    if(book.user_id.toString() !== req.user.id) {
        req.response = {
            code: 403,
            message: "User don't have the permission to delete other user's wishlist",
        };
        return next();
    }

    await Book.deleteOne({_id: req.params.id});
    req.response = {
        code: 200,
        message: "Book removed successfully!",
        data: {book}
    };
    return next();
});

module.exports = {
    getAllBooks, 
    addBook, 
    findBook, 
    updateBook, 
    removeBook
};