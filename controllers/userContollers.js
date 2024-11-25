const database = require("../config/database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();



const signup = async (req, res, next) => {

    const { first_name, last_name, email, password } = req.body

    if(typeof first_name !== "string") return res.status(400).json({error: "first name must be a string!"});
    if(typeof last_name !== "string") return res.status(400).json({error: "last name must be a string!"});
    if(!email.includes("@")) return res.status(400).json({error: "Email must contain '@' symbol!"});
    if(password.length <= 6) return res.status(400).json({error: "Password must be at least 7 characters long!"});


    try{
        // make sure email is unique
        const [rowsEmail] = await database.execute("SELECT email FROM users WHERE email = ?", [email]);

        if(rowsEmail.length) return res.status(409).json({error: "Email is already in use!"});
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await database.execute("INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)", [first_name, last_name, email, hashedPassword]);

        //create token
        const userToken = jwt.sign({ user_id: result.insertId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.status(201).cookie("access_token", userToken, { httpOnly: true }).json({status: "sucess", message: "user created successfully!", user: { user_id: result.insertId }});

    }
    catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}







module.exports = { signup }
