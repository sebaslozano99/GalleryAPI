const express = require("express");
const { signup, login } = require("../controllers/userContollers.js");

const userRoutes = express.Router();


userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", );




module.exports = userRoutes;