import s3 from '../config/s3.config.js';

// use to upload file
export const s3FileUpload = async({bucketName, key, body, contentType}) => {
    return await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    })
    .promise()
}

// here we are deleting the uploaded file
// aws treat everything as object
export const deleteFile = async ({bucketName, key}) =>{
    return await s3.deleteObject({
        Bucket:bucketName,
        Key:key
    })
    .promise()
};