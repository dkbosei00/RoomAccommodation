import fs from "fs"
import AWS from "aws-sdk"

interface Params {
    Bucket : string,
    Key : string,
    Body ?: fs.ReadStream
}

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,            
})


export function uploadToAWS(file:Express.Multer.File){
    const fileStream = fs.createReadStream(file.path)
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.filename as string,
        Body: fileStream
    } as Params

    return s3.upload(params).promise()
}

export function downloadFromAWS(filekey:string){
    const downloadParams = {
        Key: filekey,
        Bucket: process.env.AWS_BUCKET_NAME
    } as Params

    return s3.getObject(downloadParams).createReadStream()
}