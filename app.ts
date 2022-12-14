import express, {Request, Response, NextFunction} from "express"
import auth from "./api/auth"
import user from "./api/user"
import host from "./api/host"
import requests from "./api/requests"
import accommodation from "./api/accomodation"
import dotenv from "dotenv"
import { tokenGeneration } from "./middleware/tokenGeneration"
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

app.use("/api/auth", auth)
app.use("/api/user", user)
app.use("/api/host", host)
app.use("/api/requests", requests)
app.use("/api/acc", accommodation)
connectDB()

app.get("/", (req:Request, res:Response)=>{
    res.send("This is the home page.")
})

app.post("/token", tokenGeneration)


try{
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})
}catch(err){
    console.log(`An error occured: ${err}`);
    
}

export default app