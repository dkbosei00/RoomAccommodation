import express, {Request, Response, NextFunction} from "express"
const db =require("../sequelize/models")
const DB:any = db
const {Requests} = DB

export const book = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {req_type, check_in, check_out, comments} = req.body
        // Format for is in YYYY-MM-DD
        let currentDate = new Date()
        let newCurrentDate = currentDate.toISOString().split("T")[0]
        if(req_type === "Booking"){
            if(check_in >= newCurrentDate && check_out > check_in){
            let newRequest = await Requests.create({req_type: req_type, check_in: check_in, check_out: check_out, comments: comments})

            console.log("Request:", newRequest);
            return res.status(201).json({
                message: "Request was successfully created",
                user: newRequest?.id,
                status: newRequest?.status
        })
        }else{
            res.status(400).json({
                message: "Invalid Date"
            })
        }

    }
}catch (error) {
        console.log({error: error})
        return res.json({error: error})
    }
}

export const editBook = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        const {check_in, check_out, comments} = req.body
        // Format for is in YYYY-MM-DD
        let currentDate = new Date()
        if((check_in && check_out == undefined) || (check_in || check_out == undefined) || (check_in > currentDate && check_out >= check_in)){
        let newRequest = await Requests.update({
            check_in: check_in,
            check_out: check_out,
            comments: comments
        },
        {
            where: {id: id}
        })
        
        res.status(202).json({
            message: "Successfully updated.",
            changedRequest: newRequest
        })
        }
    } catch (error) {
        console.log({error: error});
        return res.json({error: error})
    }
}

export const comment = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
            const {comment} = req.body
            let addComment = await Requests.update({
                comment: comment
            },{
                where: {id: id}
            })

            res.status(200).json({
                message: "Comment added",
                comment: comment,
                hasChanged: addComment
            })
        
    } catch (error) {
        console.log({error: error});
        
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
        
    }
}