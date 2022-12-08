import express, {NextFunction, Request, Response} from "express"
const db =require("../sequelize/models")
const DB:any = db
const {Users} = DB

export const host = async (req:Request, res:Response, next:NextFunction) =>{
    const {id, role} = req.body
    const user = await Users.update({
        role: role
    },{
        where: {id: id}
    }
    )
    
    res.status(200).json({
        message: "Role changed.",
        roleChanged: user
    })

}