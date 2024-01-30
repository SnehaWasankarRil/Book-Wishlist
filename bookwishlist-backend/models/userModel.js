const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please add the user name"],
        unique: [true, "Username already taken"]
    },
    email:{
        type: String,
        required: [true, "Please add the user email address"],
        unique: [true, "Email address already taken"]
    },
    password:{
        type: String,
        required: [true, "Please add the user password"]
    },
    preferredGenre: {
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Comic', 'Horror'],//case sensitive
        required: [true, "Please select a genre"]
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);