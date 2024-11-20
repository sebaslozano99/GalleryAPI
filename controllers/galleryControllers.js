const database = require("../config/database.js");



// GET request
const showGallery = async (req, res, next) => {

    try{
        const [rows] = await database.execute("SELECT * FROM gallery WHERE user_id = ?", [1]);
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

    console.log("BODY: ", req.body);
    console.log("FILE: ", req.file);
    const { filename } = req.file;
    const { user_id } = req.body;

    try{
        const [result] = await database.execute("INSERT INTO gallery (user_id, url_path) VALUES (?, ?)", [+user_id, filename]);
        // console.log(result);
        res.status(200).json({"message": "new photo added!"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}





module.exports = { showGallery, postOneImage }