const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const YML = require('yamljs'); // Make sure to install this package using: npm install yamljs

// Swagger Setup
const swaggerUi = require("swagger-ui-express");


// database file
connectDb();
const app = express();

//middlewares
app.use(express.json());
app.use("/api/contacts", require("./routes/wishlistRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler)


// Swagger
const swaggerDocument = YML.load('./swagger.yml'); 
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// just for testing
app.get('/', (req, res) => {
    res.send("welcome to api");
});

const port = process.env.PORT || 5000;
// const port = 5000;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});