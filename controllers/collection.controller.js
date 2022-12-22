import collectionModel from '../models/collection.schema';
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";


/**************************************************************************
@CREATE_COLLECTION
@route http://localhost:4000/api/collection
@description create a new collection 
@parameters collectionName
@returns User Object
***************************************************************************/
export const createCollection = asyncHandler(async (req, res) => {
    // storing collection name coming from frontend in collectionName variable 
    const { collectionName } = req.body;

    //checking validation if there no collectionName is present 
    if (!collectionName) {
        throw new customError(`Collection Name is required`, 400);
    }

    // now send the collectionName to database
    const collectionNameDb = collectionModel.create({
        name
    });

    //send this response value to frontend
    res.status(200).json({
        sucess: true,
        message: `Collection created succesfully ${collectionNameDb}`,
        collectionNameDb
    });

});








