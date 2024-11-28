const express = require("express");
const upload = require("../config/imageStorage.js");
const { validateToken } = require("../middlewares/validateToken.js");
const { showGallery, getSinglePicture, postOneImage, deleteOneImage, updateImage } = require("../controllers/galleryControllers.js");


const galleryRoute = express.Router();


//the param :userID will be assign in the fronted 
galleryRoute.get("/gallery/:userID", showGallery);
galleryRoute.get("/gallery/:userID/:pictureID", getSinglePicture);
galleryRoute.post("/gallery", upload.single("picture"), postOneImage);
galleryRoute.delete("/gallery/:pictureID", deleteOneImage);
galleryRoute.put("/gallery/:pictureID", upload.single("picture"), updateImage);


module.exports = galleryRoute;