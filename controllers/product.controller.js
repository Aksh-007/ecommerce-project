import productModel from '../models/product.schema.js';
import formidable from 'formidable';
//this is a inbuilt package in node module for file system
import fs from 'fs';
import { s3FileUpload, deleteFile } from '../services/imageUpload.js';
import Mongoose from 'mongoose';
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async (req, res) => {
    
});