import express, {NextFunction, Request, Response} from "express"
import Sequelize from "sequelize"
const db =require("../sequelize/models")

const DB:any = db
const {Accommodation} = DB

type Accomodations = {
    name?: string,
    description?: string,
    location?: string,
    price?: number
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
        
    }
}

export const getAllAccommodations = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        let accommodations = await Accommodation.findAll({
            order: [["name"]]
        })

        const getFunction = accommodations.map((accommodation: any)=>{
            const container:Accomodations = {}
            container.name = accommodation.name,
            container.description = accommodation.description,
            container.location = accommodation.location,
            container.price = accommodation.price

            return container
        })

        res.status(200).json({
            Accommodation: getFunction
        })

    } catch (error) {
        console.log({error: error});
        
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
        
    }
}

export const provideFeedback = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = req.params["id"]
        const {feedback, rating} = req.body
        let feedbacks = await Accommodation.findAll({
            attributes: ["feedback"]
        }, {
            where: {id: id}
        })

        feedbacks.push(feedback)

        let providedFeedback = await Accommodation.update(
            {
                feedback: [feedbacks],
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
        
    }
}

export const getFeedback = async (req:Request, res:Response, next:NextFunction) => {
    
}

export const search = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {query} = req.body
        let searchQuery = Accommodation.findAll({
            attributes: ["name"],
            where: {
                [Sequelize.Op.or]:[{
                    name:{
                    [Sequelize.Op.iLike]: "%" + query
                    }
                },
            {
                description: {
                    [Sequelize.Op.iLike]: "%" + query
                }
            }]
            }
        })

        
        res.status(201).json({
            message: "These are the necessary results",
            searchQuery
        })

    } catch (error) {
        console.log({error: error});
        
    }
}