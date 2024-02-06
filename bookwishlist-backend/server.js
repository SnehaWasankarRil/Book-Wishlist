const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const resHandler = require("./middleware/responseHandler");
const dotenv = require("dotenv").config();
const YML = require('yamljs'); 

// Swagger Setup
const swaggerUi = require("swagger-ui-express");


// database file
connectDb();
const app = express();

//middlewares

app.use(express.json());
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
app.use(resHandler);

// Swagger 
const swaggerDocument = YML.load('./swagger.yml'); 
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);



const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});

module.exports = app;