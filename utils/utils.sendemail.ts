import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const sendEmail = async (email: string, subject: string, text: string) =>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.ETHEREAL_HOST as string,
            port: 587,
            secure: false,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text
        })

        console.log("Email was sent successfully");
        
    } catch (error) {
        console.log({error: error});
        
    }
}