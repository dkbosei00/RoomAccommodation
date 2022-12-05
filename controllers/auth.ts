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



export const signup = async (req: Request, res: Response, next: NextFunction) =>{

    try{
        
       const {email, first_name, last_name, password, phone_number} = req.body

        let salt = await brcypt.genSalt()
        let _hash = await brcypt.hash(password, salt)
        
        let user = await Users.create({email: email, first_name: first_name, last_name: last_name, 
            password: _hash, phone_number: phone_number})
        
        //TODO: Check add re enter password functionality
        console.log("user:",user);

        const maxAge = 60 * 60 * 3 //3 hours
        const token = jsonwebtoken.sign({
            id: user?.id,
            email,
            role: user?.role
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: maxAge
        } )

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        })

        res.status(200).json({
            message: "User was successfully created",
            user: user.id,
            role: user.role,
            token: token
        })
    }catch(err){
        console.log({error: err});
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
        console.log(user);
        if(!user){
            return res.status(400).json({message: "User not found."})
        }
        else{
            let pwdComparison = await brcypt.compare(password, user.password)
            if(pwdComparison){
                const maxAge = 60 * 60 * 3 //3 hours
                const token = jsonwebtoken.sign({
                    id : user?.id,
                    email,
                    role: user.role
                },
                ACCESS_TOKEN_SECRET,
                {expiresIn: maxAge}
                )

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            })
            
            res.status(201).json({
                message: "User has successfully logged in.",
                email: user?.email,
                role: user?.role
            })

        }else{
            return res.status(400).json({message: "User log in failed."})
        }
    }
}catch(err){
        console.log({error: err});
        
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        res.cookie("jwt", "", {maxAge: 1})
        res.redirect("/")
    }catch(err){
        console.log({error: err});
        
    }
}

