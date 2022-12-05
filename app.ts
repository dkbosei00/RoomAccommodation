import express, {Request, Response, NextFunction} from "express"
import auth from "./routes/auth"
import user from "./routes/user"
import host from "./routes/host"
import requests from "./routes/requests"

const {sequelize} = require("./sequelize/models")
const app = express()
const port: number = 8080
const cookieParser = require("cookie-parser")
const connectDB = async() =>{
    console.log("Checking database connection");
    
    try{
        sequelize.authenticate()
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

app.use("/auth", auth)
app.use("/user", user)
app.use("/host", host)
app.use("/requests", requests)
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