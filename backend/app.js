const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//imorting routes
const user = require("./routes/user.js");
//using routes
app.use("/api/", user);

module.exports = app;
