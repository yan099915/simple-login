const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./routes/userRouter");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

module.exports = app;
