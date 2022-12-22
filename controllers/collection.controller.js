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
    const collectionNameDb = await collectionModel.create({
        name
    });

    //send this response value to frontend
    res.status(200).json({
        sucess: true,
        message: `Collection created succesfully ${collectionNameDb}`,
        collectionNameDb
    });

});



/**************************************************************************
@UPDATE_COLLECTION
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@parameters userName,email,password
@returns User Object
***************************************************************************/
export const updateCollection = asyncHandler(async (req, res) => {
    // in this funtion we have to  take existing value and the frontend is sending id of existing user to update in req.params 
    const { id: collectionId } = req.params;

    //here we are updting the existing value with the new value
    const { newCollectionName } = req.body;

    // handling validation for new Colection Name 
    if (!newCollectionName) {
        throw new customError(`Collection Name is required`, 400);
    }

    let updatedCollectionName = await collectionModel.findByIdAndUpdate(
        collectionId,
        {
            newCollectionName
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedCollectionName) {
        throw new customError(`Collection Not Found `, 400)
    }

    //send response to frontend
    res.status(200).json({
        sucess:true,
        message:`Collection updated sucessfully `,
        updatedCollectionName
    });

});





