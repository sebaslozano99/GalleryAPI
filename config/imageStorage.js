const multer = require("multer");
const shortid = require('shortid');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "../../uploads");
    },
    filename: function (req, file, cb) {
      console.log("file: ", file);
      const fileExtension = file.mimetype.split("/")[1]; 
      cb(null, `${shortid.generate()}.${fileExtension}`);
    }
});
  
const upload = multer({ storage: storage });



module.exports = upload;