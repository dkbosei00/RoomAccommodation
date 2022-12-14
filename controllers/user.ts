import express, {NextFunction, Request, Response} from "express"
import crypto from "crypto"
import brcypt from "bcrypt"
import nodemailer from "nodemailer"

const db =require("../sequelize/models")
const DB:any = db
const {Users} = DB

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

// const transport = nodemailer.createTransport({
//     host: 
// })

type verifiedUser = {
    user: {
        id: string
    }
}

export const changePassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = res.locals.user?.id
        console.log({id: id});
        
        const {oldPassword, password, reEnterPassword} = req.body
        const user = await Users.findByPk(id)
        
        let pwdComparison = await brcypt.compare(oldPassword, user.password)
        if(pwdComparison){
            if(password === reEnterPassword){
            let _hash = brcypt.hash(password, 10)
            let newPassword = Users.update({
                password: _hash
            },
            {
                where: {id: id}
            }
            )
    
            res.status(200).json({
                message: "Password has been successfully changed.",
                hasPasswordChanged: newPassword
            })
            
            
            return res.redirect("/login")
        }else{
            return res.status(400).json({
                message: "Password does not match."
            })
        }
        }else{
            return res.send(400).json({
                message: "Password does not match previous password"
            })
        }
    } catch (error) {
        console.log({error: error});
    }
}


export const editprofile = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {email, first_name, last_name, phone_number} = req.body  
        const id = res.locals?.id      
        let updateProfile = await Users.update({
            email: email,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number
        },
        {
            where: {id: id}
        }
        )

        res.status(200).json({
            message: "Profile successfully updated.",
            Profile: updateProfile
        })

    } catch (error) {
        console.log({error: error});
        
    }
}

export const forgotPwd = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const resetPasswordToken = crypto.randomBytes(20).toString("hex")
        const resetPasswordExpires = Date.now() + 3600000
    } catch (error) {
        console.log({error: error});
        
    }
}

