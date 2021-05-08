const express = require("express");
const connectDB = require("./DB/connect");
const app = express();

//DB
connectDB();

//Dotenv
require("dotenv").config();

//Init middleware
app.use(express.json());

//test route
app.use("/", (req, res) => {
  res.send("hello");
});

PORT = process.env.PORT;
MODE = process.env.MODE;
app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on PORT ${PORT}`);
});
