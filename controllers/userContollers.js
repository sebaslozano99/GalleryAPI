const database = require("../config/database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


//In the fronted, on the initial page load, the fronted will fetch this endpoint, to get verify there is a token, and if there is one, it'll return the user's information that was encoded in the token
const verifyToken = async (req, res) => {
    const { access_token } = req.cookies;

    if(!access_token) return res.status(401).json({message: "Unathorized or expired token!"});

    jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) return res.status(401).json({message: "Unauthorized!"});

        return res.json(user);
    });
}





const signup = async (req, res, next) => {

    const { first_name, last_name, email, password } = req.body;

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
        const token = jwt.sign(
            { 
                user_id: result.insertId,
                user_fullname: `${first_name} ${last_name}`
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "1h" }
        );


        res.cookie("access_token", token, { httpOnly: true });
        res.status(201).json({message: "user created successfully!", user: { user_id: result.insertId,  user_fullname: `${first_name} ${last_name}`}});

    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error.message || error.error || "Internal Server Error"}); 

    }
}



const login = async (req, res, next) => {

    const { email, password } = req.body;

    try{
        // make sure Email exists in the Database
        const [rows] = await database.execute("SELECT * FROM users WHERE email = ?", [email]);
        if(!rows.length) return res.status(404).json({error: "Email not found in the database!"});

        //compare passed password with the one in the Database
        const isCorrectPassword = await bcrypt.compare(password, rows[0].password);
        if(!isCorrectPassword) return res.status(401).json({error: "Invalid password!"});
        
        const user_fullname = `${rows[0].first_name} ${rows[0].last_name}`;

        //create token
        const token = jwt.sign(
            {
                user_id: rows[0].id, 
                user_fullname
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "1h" }
        );

        res.cookie("access_token", token, { httpOnly: true });
        res.json({message: "Logged in successfully!", user: { user_id: rows[0].id , user_fullname}});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error.message || error.error || "Internal Server Error"}); 
    }
}




const logout = async (req, res, next) => {

    try{
        res.clearCookie("access_token");
        res.status(200).json({message: "Logged out"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error.message || error.error || "Internal Server Error"}); 
    }
}




module.exports = { signup, login, logout, verifyToken }
