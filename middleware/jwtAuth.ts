import express, {Request, Response, NextFunction} from "express"
import jsonwebtoken from "jsonwebtoken"
const db =require("../sequelize/models")

const DB:any = db
const {Users} = DB

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

export const jwtAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader?.split(" ")[1] //Token is in the form "Bearer [Token String]"
        console.log(token);

        if (token == null){
            res.status(401).json({
                message: "Token unavailable"
            })
        }else{
            jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, (err, user) =>{
                if(err instanceof Error){
                    res.status(401).json({
                        message: "An error occured in validation"
                    })
                }
                else{
                    res.locals.user = user
                    next()

                }
            })
        }

    } catch (error) {
        console.log({error: error});
    }

}

