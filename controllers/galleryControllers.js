const database = require("../config/database.js");



// GET request
const showGallery = async (req, res, next) => {

    const { user_id } = req.body;

    try{
        const [rows] = await database.execute("SELECT * FROM gallery WHERE user_id = ?", [user_id]);
        res.status(200).json(rows);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}


// GET request -- show one image based on ID
const showOneImage = (req, res, next) => {
    res.send("One image");
}


// POST request --
const postOneImage = (req, res, next) => {
    res.send("Image uploaded successfully!");
}





module.exports = { showGallery, showOneImage, postOneImage }