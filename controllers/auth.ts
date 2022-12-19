import express, { NextFunction, Request, Response } from "express"
import sequelize from "sequelize"
import brcypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const db =require("../sequelize/models")

const DB:any = db
const {Users} = DB

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string




export const signup = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        
       const {email, first_name, last_name, password, reEnterPassword, phone_number} = req.body

        let salt = await brcypt.genSalt()
        let _hash = await brcypt.hash(password, salt)
        

        if(password === reEnterPassword){
        let user = await Users.create({email: email, first_name: first_name, last_name: last_name, 
            password: _hash, phone_number: phone_number})
        

        return res.status(201).json({
            message: "User was successfully created",
            user: user.id,
            role: user.role
        })}
    }catch(err){
        console.log({error: err});
        return res.json({error: "An error occered."})
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({message: "Email or password not found"})
        }
        const user = await Users.findOne({
            where: {
                email: email
            }
        })

        if(!user){
            return res.status(400).json({message: "User not found."})
        }
        else{
            let pwdComparison = await brcypt.compare(password, user.password)
            if(pwdComparison){
                const accessToken = jsonwebtoken.sign( 
                    {id: user?.id, email, role: user?.role},
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: "20m" })
        
                const refreshToken = jsonwebtoken.sign(
                    {id: user?.id, email, role: user?.role},
                    REFRESH_TOKEN_SECRET,
                    { expiresIn: "1d" })

                res.status(202).json({
                    message: "User successfully logged in.",
                    id: user.id,
                    email: user.email,
                    accessToken,
                    refreshToken
                })
                

        }else{
            return res.status(400).json({message: "User log in failed."})
        }
    }
}catch(err){
        console.log({error: err});
        return res.json({error: "An error occered."})
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        //CHECK!
        res.status(202).json({ message: "User has been successfully logged out."})
        return res.redirect("/")
    }catch(err){
        console.log({error: err});
        return res.json({error: "An error occered."})
    }
}

