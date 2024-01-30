const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    bookTitle: {
        type: String,
        required: [true, "Please add the book title"],
    },
    bookDescription: {
        type: String,
        required: [true, "Please add the book description"],
    },
    genre: {
        type: String,
        required: [true, "Please add the book genre"],
    },
    completionStatus: {
        type: String,
        required: [true, "Please add the completion status"],
        enum: ['Pending', 'Completed']
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("Contact", contactSchema);