import express, {NextFunction, Request, Response} from "express"
import crypto from "crypto"
import brcypt from "bcrypt"
import { sendEmail } from "../utils/utils.sendemail"
import dotenv from "dotenv"

const db =require("../sequelize/models")
const DB:any = db
const {Users} = DB
dotenv.config()

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string


type verifiedUser = {
    user: {
        id: string
    }
}

export const changePassword = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = res.locals.user?.id
        
        const {oldPassword, password, reEnterPassword} = req.body
        const user = await Users.findByPk(id)
        
        let pwdComparison = await brcypt.compare(oldPassword, user.password)
        if(pwdComparison){
            if(password === reEnterPassword){
            let _hash = await brcypt.hash(password, 10)
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

export const forgotPassword = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {email} = req.body
        const user = Users.findByPk(email)
        if(!user){
            return res.status(404).json({
                message: "User could not be found."
            })
        }

        let token = user.reset_password_token
        if(!token){
            token = await Users.update({
                reset_password_token: crypto.randomBytes(32).toString("hex")
            },
            {
                where: {email: email}
            })
        }

        const link = `${process.env.BASE_URL}/api/user/${user.id}/${user.reset_password_token}`

        sendEmail(user.email, "Password Reset", link)

        res.send("Reset token has been sent to the user")
    } catch (error) {
        console.log({error: error});
        
    }
}

export const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
    const id = req.params["userId"]
    const token = req.params["token"]
    const {password} = req.body
    const {reEnterPassword} = req.body

    let user = Users.findOne({
        where: {
            id: id,
            reset_password_token: token
        } 
    })

    if(!user) return res.status(404).json({message: "Token does not exist or has expired."})

    if(password === reEnterPassword){
        let _hash = await brcypt.hash(password, 10)
        let newPassword = Users.update({
            password: _hash,
            reset_password_token: null
        },
        {
            where: {id: id}
        }
        )

        res.status(200).json({
            message: "Password has been successfully reset."
        })
}else{
    return res.status(400).json({
        message: "Passwords do not match."
    })
}
}