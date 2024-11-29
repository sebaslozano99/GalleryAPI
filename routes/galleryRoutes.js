const express = require("express");
const upload = require("../config/imageStorage.js");
const multer = require("multer");
const { validateToken } = require("../middlewares/validateToken.js");
const { showGallery, getSinglePicture, postOneImage, deleteOneImage, updateImage } = require("../controllers/galleryControllers.js");


const galleryRoute = express.Router();



//the param :userID will be assign in the fronted 
galleryRoute.get("/gallery/:userID", validateToken, showGallery);

galleryRoute.get("/gallery/:userID/:pictureID", validateToken, getSinglePicture);   

galleryRoute.post("/gallery", validateToken, upload.single("picture"), postOneImage);

galleryRoute.delete("/gallery/:pictureID", validateToken, deleteOneImage);

galleryRoute.put("/gallery/:pictureID", validateToken, upload.single("picture"), updateImage);



// middleware to handle error in case user uploads images with undesired mimetypes
galleryRoute.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error (e.g., file size limit exceeded, or file type error)
        if (err.message === 'Invalid file type') {
            return res.status(400).json({ message: "Invalid file type" });
        }
        // You can handle other Multer errors here (like file size issues)
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
    next();
});


module.exports = galleryRoute;