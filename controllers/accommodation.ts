import express, {NextFunction, Request, Response} from "express"
import Sequelize from "sequelize"
import { downloadFromAWS, uploadToAWS } from "../utils/utils.AWSImageHandler"
import fs from "fs"
import util from "util"
const db =require("../sequelize/models")

const DB:any = db
const {Accommodation} = DB
const {Requests} = DB

type Accomodations = {
    name?: string,
    description?: string,
    location?: string,
    price?: number
}


function listAccommodations (accommodationQuery:any){
    const list = accommodationQuery.map((accommodation:any) => {
        const container:Accomodations = {}
        container.name = accommodation.name
        container.description = accommodation.description
        container.price = accommodation.price
        container.location = accommodation.location

        return container
    })

    return list
}


export const addAccommodation = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {name, description, location, feedback, no_of_rooms, has_wifi, price, rating} = req.body
        if(res.locals.user?.role === "Host" || "Admin"){
            const host_id = res.locals.user?.id
            
            let accommodation = Accommodation.create({name: name, description: description, location: location, feedback: feedback, no_of_rooms: no_of_rooms, has_wifi: has_wifi, price: price, rating: rating, host_id: host_id})
            
            console.log(accommodation);
            
            res.status(201).json({
                message: "Accomodation has successfully been created.",
                id: accommodation.id,
                name: accommodation.name,
                price: accommodation.price
            })
        }else{
            res.status(401).json({
                message: "User is not authorized to perform this action."
            })
        }
            
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const getAllAccommodations = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        let accommodations = await Accommodation.findAll({
            order: [["name"]]
        })

        res.status(200).json({
            Accommodation: listAccommodations(accommodations)
        })

    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const getAccommodationById = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = req.params["id"]
        let accommodation = await Accommodation.findByPk(id)
        
        if(!accommodation){
            console.log("No Accommodation by this id.");
            
        } else{
        res.status(200).json({
            message: "This is your accommodation.",
            Accommodation: accommodation
        })

    }
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const updateAccommodation = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        const {name, description, location, no_of_rooms, has_wifi, price} = req.body
        let updateAccommodation = await Accommodation.update(
            {
                name: name,
                description: description,
                location: location,
                no_of_rooms: no_of_rooms,
                has_wifi: has_wifi,
                price: price
            },
            {
                where: {id: id}
            }
        )
        // handleResult(result)


        res.status(200).json({
            message: "Accomodation has been updated",
            Accommodation: updateAccommodation
        })

    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}


export const provideFeedback = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = req.params["id"]
        const {feedback, rating} = req.body

        let accommodation = await Accommodation.findByPk(id)

        let providedFeedback = await Accommodation.update(
            {
                feedback: [...accommodation.feedback, feedback],
                rating: rating
            },
            {
                where: {id: id}
            }
        )


        
        res.status(200).json({
            message: "Feedback provided.",
            feedback: providedFeedback
        })

    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const getFeedback = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = req.params["id"]
        let accommodation = await Accommodation.findByPk(id)
    
        res.status(201).json({
            message: "Here is the feedback.",
            feedback: accommodation.feedback
        })
    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const search = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {query} = req.body
        let searchQuery = await Accommodation.findAll({
            attributes: ["name", "description"],
            where: {
                [Sequelize.Op.or]:[{
                    name:{
                    [Sequelize.Op.iLike]: "%" + query + "%"
                    }
                },
            {
                description: {
                    [Sequelize.Op.iLike]: "%" + query + "%"
                }
            }]
            }
        })

        
        res.status(201).json({
            message: "These are the necessary results",
            "Relevant search": listAccommodations(searchQuery)
        })

    } catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const uploadImage = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const id = req.params["id"]
        const unLinkFile = util.promisify(fs.unlink)

        if(req.file == undefined) return res.sendStatus(400)
        else{
            const file = req.file
            let result = await uploadToAWS(file)
            await unLinkFile(file.path)
            let addImageURL = await Accommodation.update(
                {
                    image_url: result.Location
                },
                {
                    where: {id: id}
                }
                )
            
            res.status(200).json({
                message: "Image uploaded",
                key: result.Key,
                "URL Added": addImageURL
            })
                
        }
    }catch (error) {
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const downloadImage = (req:Request, res:Response, next:NextFunction) =>{
    try{
    const key = req.params["key"]
    const readStream = downloadFromAWS(key)

    readStream.pipe(res)
    }catch(error){
        console.log({error: error});
        return res.sendStatus(500)
    }
}

export const book = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {req_type, check_in, check_out, comments} = req.body
        const acc_id = req.params["id"]
        const guest_id = res.locals.user?.id
        // Format for is in YYYY-MM-DD
        let currentDate = new Date()
        let newCurrentDate = currentDate.toISOString().split("T")[0]
        if(req_type === "Booking"){
            if(check_in >= newCurrentDate && check_out > check_in){
            let newRequest = await Requests.create({request_type: req_type,
                                check_in: check_in, 
                                check_out: check_out, 
                                comments: comments, 
                                accommodation_id: acc_id, 
                                guest_id: guest_id})

            console.log("Request:", newRequest);
            return res.status(201).json({
                message: "Request was successfully created",
                "Request id": newRequest?.id,
                status: newRequest?.status
        })
        }else{
            return res.status(400).json({
                message: "Invalid Date"
            })
        }

    }
}catch (error) {
        console.log({error: error})
        return res.sendStatus(500)
    }
}