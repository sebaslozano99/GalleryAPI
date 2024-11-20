const express = require("express");
const upload = require("../config/imageStorage.js");
const { showGallery, postOneImage } = require("../controllers/galleryControllers.js");




const galleryRoute = express.Router();



galleryRoute.get("/gallery", showGallery);

// galleryRoute.get("/gallery/:id", showOneImage);

galleryRoute.post("/gallery", upload.single("picture"), postOneImage)




module.exports = galleryRoute;