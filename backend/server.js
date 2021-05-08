const express = require("express");

const app = express();

//Dotenv
require("dotenv").config();

//test route
app.use("/", (req, res) => {
  res.send("hello");
});

PORT = process.env.PORT;
MODE = process.env.MODE;
app.listen(PORT, () => {
  console.log(`Server running in ${MODE} on PORT ${PORT}`);
});
