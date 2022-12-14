import express, {Request, Response, NextFunction} from "express"
import jsonwebtoken from "jsonwebtoken"


const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string


export const tokenGeneration = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const {refreshToken} = req.body
        if (refreshToken == null) return res.sendStatus(401)
        else{
            jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET, (err:any, user:any) =>{
                if (err instanceof Error){
                    res.status(401).json({
                        message: "An error occured in validation"
                    })
                }
                else{
                    const accessToken = generateToken({id: user?.id, email: user?.email, role: user?.role})
                    res.status(201).json({
                        accessToken
                    })

                    next()
                }
            })
        }
    } catch (error) {
        console.log({error: error});
        
    }
}

function generateToken(user:any){
    return jsonwebtoken.sign({id: user?.id, email: user?.email, role: user?.role}, ACCESS_TOKEN_SECRET, { expiresIn: "20m" })
}