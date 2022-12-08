import express, {Request, Response, NextFunction} from "express"
import jsonwebtoken from "jsonwebtoken"
const db =require("../sequelize/models")

const DB:any = db
const {Users} = DB

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string

export const adminAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
        const token = req.cookies.jwt
        console.log(token);
        
        if(token){
            jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, async (err:any, decodedToken:any) => {
                if(err){
                    throw err
                }else{
                    if(decodedToken?.role !== "Admin"){
                        return res.status(401).json({
                            message: "User cannot access this endpoint."
                        })
                    } else{
                        const user = await Users.findOne({
                            where: {
                                id: decodedToken?.id
                            }
                        })
                        res.json({ user })
                        next()
                    }
                }
            })
        }else{
            return res.status(401).json({
                message: "Token missing"
            })
        }
    } catch (error) {
        console.log({error: error});
    }

}

export const hostAuth = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const token = req.cookies.jwt
        console.log(token);
        
        if(token){
            jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, async (err:any, decodedToken:any) => {
                if(err){
                    throw err
                }else{
                    if(decodedToken?.role !== "Host"){
                        return res.status(401).json({
                            message: "User cannot access this endpoint."
                        })
                    } else{
                        const user = await Users.findOne({
                            where: {
                                id: decodedToken?.id
                            }
                        })
                        res.json({ user })
                        next()
                    }
                }
            })
        }else{
            return res.status(401).json({
                message: "Token missing"
            })
        }
    } catch (error) {
        console.log({error: error});
    }
}

export const basicAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies.jwt
        console.log(token);
        
        if(token){
            jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, async (err:any, decodedToken:any) => {
                if(err){
                    throw err
                }else{
                    if(decodedToken?.role !== "Basic"){
                        return res.status(401).json({
                            message: "User cannot access this endpoint."
                        })
                    } else{
                        const user = await Users.findOne({
                            where: {
                                id: decodedToken?.id
                            }
                        })
                        res.json({ user })
                        next()
                    }
                }
            })
        }else{
            return res.status(401).json({
                message: "Token missing"
            })
        }
    } catch (error) {
        console.log({error: error});   
    }
}