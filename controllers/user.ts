import express, {NextFunction, Request, Response} from "express"
import crypto from "crypto"
const db =require("../sequelize/models")

const DB:any = db
const {Users} = DB

export const reset = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
    } catch (error) {
        console.log({error: error});
    }
}

export const editprofile = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {email, first_name, last_name, phone_number} = req.body        
        let updateProfile = await Users.update({
            email: email,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number
        },
        {
            where: {email: email}
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