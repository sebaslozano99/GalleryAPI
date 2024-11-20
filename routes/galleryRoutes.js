const express = require("express");
const { showGallery, showOneImage, postOneImage } = require("../controllers/galleryControllers.js");


const galleryRoute = express.Router();



galleryRoute.get("/gallery", showGallery);

galleryRoute.get("/gallery/:id", showOneImage);

galleryRoute.post("/gallery", postOneImage)




module.exports = galleryRoute;