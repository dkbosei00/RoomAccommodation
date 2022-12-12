import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import auth from "./api/auth"
import user from "./api/user"
import host from "./api/host"
import requests from "./api/requests"
import accommodation from "./api/accomodation"
import morgan from "morgan"

dotenv.config()
const {sequelize} = require("./sequelize/models")
const app = express()
const port: number = 8080 || process.env.PORT_ENV
const cookieParser = require("cookie-parser")
const connectDB = async() =>{
    console.log("Checking database connection");
    
    try{
        await sequelize.authenticate()
        console.log("Database connected.");
    }catch(error){
        console.log("Database connected failed.", error);
        process.exit(1)
        
    }
}

//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use("/auth", auth)
app.use("/user", user)
app.use("/host", host)
app.use("/requests", requests)
app.use("/acc", accommodation)
connectDB()

app.get("/", (req, res)=>{
    res.send("This is the home page.")
})

try{
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})
}catch(err){
    console.log(`An error occured: ${err}`);
    
}

module.exports = app