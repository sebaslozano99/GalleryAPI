const express = require("express");
const upload = require("../config/imageStorage.js");
const { showGallery, postOneImage, deleteOneImage } = require("../controllers/galleryControllers.js");


const galleryRoute = express.Router();



galleryRoute.get("/gallery", showGallery);
galleryRoute.post("/gallery", upload.single("picture"), postOneImage);
galleryRoute.delete("/gallery/:pictureID", deleteOneImage);



module.exports = galleryRoute;