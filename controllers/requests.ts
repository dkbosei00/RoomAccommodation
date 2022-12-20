import express, {Request, Response, NextFunction} from "express"
const db =require("../sequelize/models")
const DB:any = db
const {Requests} = DB



export const editBook = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        const {check_in, check_out} = req.body
        // Format for is in YYYY-MM-DD
        let currentDate = new Date()
        if((check_in || check_out == undefined) || (check_in > currentDate && check_out >= check_in)){
        let newRequest = await Requests.update({
            check_in: check_in,
            check_out: check_out
        },
        {
            where: {id: id}
        })
        
        res.status(202).json({
            message: "Successfully updated.",
            changedRequest: newRequest
        })
        }else {
            return res.status(400).json({message: "Invalid Date"})
        }

    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const comment = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
            const {comment} = req.body
            let addComment = await Requests.update({
                comments: comment
            },{
                where: {id: id}
            })

            res.status(200).json({
                message: "Comment added",
                comment: comment,
                addComment
            })
        
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}


export const approve = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        if(res.locals?.role === "Host"){
            const {status} = req.body
            let approve = await Requests.update({
                status: status
            },{
                where: {id: id}
            })

            res.status(200).json({
                message: "Status changed",
                hasChanged: approve
            })
        }
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const reject = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        if(res.locals?.role === "Host"){
            const {status} = req.body
            let reject = await Requests.update({
                status: status
            },{
                where: {id: id}
            })

            res.status(200).json({
                message: "Status changed",
                hasChanged: reject
            })
        }
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}