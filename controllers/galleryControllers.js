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


// POST request --
const postOneImage = async (req, res, next) => {

    const file = req.file;
    console.log(file);

    try{
        res.send("Image uploaded!");
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}





module.exports = { showGallery, postOneImage }