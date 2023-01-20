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
                    return {
                        secure_url: upload.Location
                    }
                })
            )

            let imgArray = await imageArrayResponse;
            const product = await productModel.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            });

            if (!product) {
                throw new customError(`Product was not created`, 400);
                // remove Image

            }
            res.status(200).json({
                sucess: true,
                product
            })

        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: error.message || ` !oops , Product was not added `
            })
        }
    })
});

/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/allproduct
 * @description Controller used to get all product
 * @description 
 * @returns all product 
 *********************************************************/

export const getAllProduct = asyncHandler(async (req, res) => {
    const allProduct = await productModel.find({})

    if (!allProduct) {
        throw new customError(`No product was found`, 404)
    }

    res.status(200).json({
        sucess:true,
        allProduct
    })
});



/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/getProductById
 * @description Controller used to get a specific product
 * @returns specific  product 
 *********************************************************/

export const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params;
    const product = await productModel.findById({productId});

    if (!product) {
        throw new customError(`No product found `, 404);
    }

    res.status(200).json({
        sucess:true,
        product
    })
});




/**********************************************************
 * @DELETE_PRODUCT
 * @route https://localhost:5000/api/deleteProduct
 * @description Controller used to get delete a product
 * @returns delete product 
 *********************************************************/

export const deleteProduct = asyncHandler(async (req, res) => {
    const deleteProductId = req.params;
    const deletedProduct = await productModel.findByIdAndDelete({deleteProductId});
    if (!deletedProduct) {
        throw new customError(`Product was not deleted`, 404)
    }

    res.status(200).json({
        sucess:true,
        deletedProduct
    })
});


