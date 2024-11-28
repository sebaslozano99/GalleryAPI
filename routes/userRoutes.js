const express = require("express");
const { signup, login, logout, verifyToken } = require("../controllers/userContollers.js");

const userRoutes = express.Router();


userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.get("/verify", verifyToken);



module.exports = userRoutes;