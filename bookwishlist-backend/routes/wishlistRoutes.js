const express = require("express");

const router = express.Router();

const {
    getAllBooks, 
    addBook, 
    findBook, 
    updateBook,
    removeBook
} = require("../controllers/wishlistController");
const validateToken = require("../middleware/validateTokenHandler");

// use validateToken for each route
router.use(validateToken);

router.route("/").get(getAllBooks).post(addBook);
router.route("/:id").get(findBook).put(updateBook).delete(removeBook);

module.exports = router;