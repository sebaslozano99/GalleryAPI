const database = require("../config/database.js");
const fs = require("fs");


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

    const { filename } = req.file;
    const { user_id } = req.body;

    console.log("req.file", req.file);
    console.log("user_id", user_id);

    try{
        const [result] = await database.execute("INSERT INTO gallery (user_id, url_path) VALUES (?, ?)", [+user_id, filename]);
        res.status(200).json({"message": "new photo added!"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}



// DELETE request
const deleteOneImage = async (req, res, next) => {

    const { pictureID } = req.params;


    try{
        //select row to be deleted and get the image file name
        const [rows] = await database.execute("SELECT url_path FROM gallery WHERE id = ?", [pictureID]);
        const imageFileToDelete = rows[0]?.url_path;
        console.log(rows[0]?.url_path);

        const [result] = await database.execute("DELETE FROM gallery WHERE id = ?", [pictureID]);
        console.log("result: ", result);

        if(result.affectedRows <= 0){
            res.status(404).json({"error": `Product with id ${pictureID} was not found!`});
            return next();
        }

        fs.unlinkSync(__dirname + `../../uploads/${imageFileToDelete}`);

        res.status(200).json({"message": "deleted successfully!"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}




module.exports = { showGallery, postOneImage, deleteOneImage }