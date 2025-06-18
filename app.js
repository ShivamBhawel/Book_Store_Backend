require("dotenv").config();
const express = require('express');
const cors = require("cors");
const db = require("./connection/db")
const userroute = require('./router/user');
const bookrouter = require('./router/book');
const favourite = require('./router/favourite');
const cart = require("./router/cart");
const order = require("./router/order");
const bodyparser = require('body-parser');



const app = express();

// Middleware
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: false })); // optional but recommended
app.use(cors());
app.use(express.json()); // 
app.use("/user", userroute);
app.use("/book",bookrouter);
app.use("/favourite",favourite);
app.use("/cart",cart);
app.use("/order",order);


app.get("/", (req, res) => {
    res.send("server started successfully");
});

const port = process.env.port;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
