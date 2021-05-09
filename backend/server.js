const express = require("express");
const connectDB = require("./DB/connect");
const app = express();

//DB
connectDB();

//Dotenv
require("dotenv").config();

//Init middleware
app.use(express.json());

//Defin Routes
app.use("/api/users", require("./api/users"));

//Run Server
PORT = process.env.PORT;
MODE = process.env.MODE;
app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on PORT ${PORT}`);
});
