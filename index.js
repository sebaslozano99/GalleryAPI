const express = require("express");
const cors = require("cors");
const galleryRoute = require("./routes/galleryRoutes.js");


const app = express();


//SETTINGS



//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static("uploads"));



//ROUTES
app.use("/api", galleryRoute);


const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`);
})