import userModel from "../models/user.schema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";
import cookiesOptions from "../utility/cookiesOptions";


cookiesOptions();

/**************************************************************************
@SIGNUP
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@parameters name,email,password
@returns User Object
***************************************************************************/

export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!(name || email || password)) {
        throw new customError('Please fill all fields', 400);
    }

    // check if user already exist / registerd
    const existingUser = await userModel.findOne({ email });
    // if user exist throw an error
    if (existingUser) {
        throw new customError("User Already Exist", 400)
    }

    // now creating an user 
    // here we dont want to encrypt the password bcoz in userModel we already written a method which decrypt every time a password file is inserted in database 
    const newUser = await userModel.create({
        // if the database fields and the frontend field is same then just pass name,if not then pass name:username something like that
        name:name,
        email,
        password
    });

    // userModel.getJwtToken this is a method in user schema so we are calling like object of schema  and this is methos so we need to call it like that userModel.getJwtToken()
    const token = newUser.getJwtToken()
    // we are setting it false bcoz in mongodb when we are creating then it will not select as false but when you querying it from mongodb then it will not share password
    console.log(user);
    userModel.password = undefined;
     
    // sending cookies in cookies  seting token 
    res.cookie('token', token, cookiesOptions)

    res.status(200).json({
        sucess:true,
        token,
        newUser
    })





});