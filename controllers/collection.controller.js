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
        collectionName
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
@route http://localhost:4000/api/collection/updateCollection
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
        sucess: true,
        message: `Collection updated sucessfully `,
        updatedCollectionName
    });

});

/**************************************************************************
@DELETE_COLLECTION
@route http://localhost:4000/api/collection/delete
@description Delete the specific collection using collectionId
@parameters collectionID
***************************************************************************/
export const deleteCollection = asyncHandler(async (req, res) => {
    const { id: collectionId } = req.params;

    const deleteCollection = await collectionModel.findByIdAndDelete(collectionId);

    if (!deleteCollection) {
        throw new customError(`Collection not found`, 400);
    }
    // deallocating the memory for code optimization
    deleteCollection.remove(); // or use delete()

    //send response to frontend
    res.status(200).json({
        sucess: true,
        message: `Collection deleted sucessfully`,
    });
});

/**************************************************************************
@COLLECTION_LIST
@route http://localhost:4000/api/getAllCollection
@description sending all the collection in a database
@parameters list of collection
***************************************************************************/
export const getAllCollection = asyncHandler(async (req, res) => {
    // here we are sending a list of collection to frontend user if want evey collection in db then pls dont any paramater in find() and if want to find using specific keyword like email then .find({email})
    const collections = await collectionModel.find();

    //checking validation 
    if (!collections) {
        throw new customError(`No Collection found`, 400);
    }

    res.status(200).json({
        sucess:true,
        collections,
    });

});