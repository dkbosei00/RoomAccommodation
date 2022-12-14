import express, {NextFunction, Request, Response} from "express"
const db =require("../sequelize/models")
const DB:any = db
const {Users} = DB

export const host = async (req:Request, res:Response, next:NextFunction) =>{
    //Provide the id of the User whose role the admin wants to change and the role it should be
    const {id, role} = req.body
    if(res.locals.user?.role === "Admin"){
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
    } else{
        res.status(401).json({
            message: "User cannot make this query."
        })
    }
}