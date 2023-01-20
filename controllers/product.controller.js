import productModel from '../models/product.schema.js';
import formidable from 'formidable';
//this is a inbuilt package in node module for file system
import fs from 'fs';
import { s3FileUpload, deleteFile } from '../services/imageUpload.js';
import Mongoose from 'mongoose';
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";
import Mongoose from 'mongoose';
import config from '../config/index.js'

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true
    });

    form.parse(req, async function (err, fields, files) {
        try {
            if (err) {
                throw new customError(err.message || "something went wrong", 500)
            }
            //generating id in mongodb using mongoose and store it in database
            let productId = new Mongoose.Types.ObjectId().toHexString();
            // console.log(fields, files);
            //check for fields
            if (!fields.name ||
                !fields.price ||
                !fields.productDescription ||
                !fields.collectionId
            ) {
                throw new customError("please fill all details", 500);
            }

            // handling images
            let imageArrayResponse = Promise.all(
                Object.keys(files).map(async (filekey, index) => {
                    const element = files[filekey]
                    const data = fs.readFileSync(element.filepath);
                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mimetype
                    })
                    return
                })
            )

        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: error.message || `Something went wrong`
            })
        }
    })
});