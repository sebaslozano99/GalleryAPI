const express = require("express");
const galleryRoute = require("./routes/galleryRoutes.js");


const app = express();


//SETTINGS



//MIDDLEWARES
app.use(express.urlencoded({extended: true}));
app.use(express.json());



//ROUTES
app.use("/api", galleryRoute);


const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`);
})