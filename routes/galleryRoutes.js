const express = require("express");
const upload = require("../config/imageStorage.js");
const { showGallery, getSinglePicture, postOneImage, deleteOneImage, updateImage } = require("../controllers/galleryControllers.js");


const galleryRoute = express.Router();



galleryRoute.get("/gallery", showGallery);
galleryRoute.get("/gallery/:pictureID", getSinglePicture);
galleryRoute.post("/gallery", upload.single("picture"), postOneImage);
galleryRoute.delete("/gallery/:pictureID", deleteOneImage);
galleryRoute.put("/gallery/:pictureID", upload.single("picture"), updateImage);


module.exports = galleryRoute;