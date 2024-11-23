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
    const { user_id, title, description } = req.body;

    console.log("req.file", req.file);
    console.log("user_id", user_id);

    try{
        const [result] = await database.execute("INSERT INTO gallery (user_id, url_path, title, description) VALUES (?, ?, ?, ?)", [+user_id, filename, title, description]);
        console.log("POST result: ", result);
        res.status(200).json({"message": "new photo added!"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}




// PUT request
const updateImage = async (req, res, next) => {

    const { pictureID } = req.params;
    const { title, description } = req.body;
    const file  = req.file;

    const toNullFileName = file?.filename === undefined ? null : file.filename;
    const toNullTitle = title === undefined ? null : title;
    const toNullDescription = description === undefined ? null : description;
    
    try{
        let imageFileToDelete;

        if(toNullFileName){
            //Select image of the row that is gonna be updated in case user changed it for a different one
            const [rows] = await database.execute("SELECT url_path FROM gallery WHERE id = ?", [pictureID]);
            imageFileToDelete = rows[0]?.url_path;
        }

        const [result] = await database.execute(`
            UPDATE gallery SET url_path = IFNULL(?, url_path), title = IFNULL(?, title), description = IFNULL(?, description) 
            WHERE id = ?`, [toNullFileName, toNullTitle, toNullDescription, pictureID]);

        if(result.affectedRows <= 0){
            res.status(404).json({"error": `Product with id ${pictureID} was not found!`});
            return next();
        }

        // If user changed picture, delete the previous one from the server
        if(toNullFileName){
            fs.unlinkSync(__dirname + `../../uploads/${imageFileToDelete}`);
        }

        res.status(200).json({"message": "Updated successfully!"})
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

        const [result] = await database.execute("DELETE FROM gallery WHERE id = ?", [pictureID]);
        console.log("result: ", result);

        if(result.affectedRows <= 0){
            res.status(404).json({"error": `Product with id ${pictureID} was not found!`});
            return next();
        }

        //once the row has been deleted from our DB, we delete the image from our server
        fs.unlinkSync(__dirname + `../../uploads/${imageFileToDelete}`);

        res.status(200).json({"message": "deleted successfully!"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message || "Internal server error"});
        next();
    }
}




module.exports = { showGallery, postOneImage, deleteOneImage, updateImage }