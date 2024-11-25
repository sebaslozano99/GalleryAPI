const express = require("express");
const { signup } = require("../controllers/userContollers.js");

const userRoutes = express.Router();


userRoutes.post("/signup", signup);
userRoutes.post("/login", );
userRoutes.post("/logout", );




module.exports = userRoutes;