const asyncHandler = require ("express-async-handler");
const Book = require("../models/wishlistModel");

const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({user_id: req.user.id});
    res.status(200).json(books);
});

const addBook = asyncHandler(async (req, res) => {
    console.log("The request body is:", req.body);
    const {bookTitle, bookDescription, genre, completionStatus} = req.body;
    if(!bookTitle || !bookDescription || !genre || !completionStatus){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const book = await Book.create({
        bookTitle,
        bookDescription,
        genre,
        completionStatus,
        user_id: req.user.id
    });
    res.status(201).json(book);
});

const findBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        res.status(404);
        throw new Error("Book not found in the wishlist");
    }
    // const book = await Book.find({user_id: req.params.id});
    const userAuthenticationCheck = await Book.findOne({ _id: req.params.id, user_id: req.user.id });
    if(!userAuthenticationCheck){
        res.status(403);
        throw new Error("User is not authenticated to view this book");
    }
    res.status(200).json(book);
});

const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        res.status(404);
        throw new Error("Book not found");
    }

    // Only the authorized user can update the contacts made by him
    if(book.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have the permission to update other user's wishlist");
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updatedBook);
});

const removeBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if(!book){
        res.status(404);
        throw new Error("Book not found");
    }

    // Only the authorized user can delete the books added by him
    if(book.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have the permission to delete other user's wishlist");
    }

    await Book.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = {
    getAllBooks, 
    addBook, 
    findBook, 
    updateBook, 
    removeBook
};