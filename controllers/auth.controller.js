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
        name: name,
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
        sucess: true,
        token,
        newUser
    })

});

/**************************************************************************
@LOGIN
@route http://localhost:4000/api/auth/login
@description User login controller 
@parameters email,password
@returns User Object
***************************************************************************/
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError('All fields are require ', 400)
    }

    // here we are quering to mongodb that we want password of user but in schema password    {select: false} so we are passing ("+password") so databse can send password and if you dont want anything like name from databse then ("-name")can use
    const user = userModel.findOne({ email }).select('+password');

    // here we are giving invalid credintial bcoz we dont want to give attacker hint that email is there just password is wrong or viceversa
    if (!user) {
        throw new customError('invalid credential', 400)
    }

    const isPasswordmatched = await user.comparePassword(password);

    if (isPasswordmatched) {
        const token = user.getJwtToken()
        user.password = undefined;
        res.cookie("token", token, cookiesOptions)
        return res.status(200).json({
            sucess: true,
            token,
            user,
        })
    }

    throw new customError('invalid credential', 400);
});


/**************************************************************************
@LOGOUT
@route http://localhost:4000/api/auth/logout
@description User logout by clearing user cookies
@parameters 
@returns success message
***************************************************************************/

export const logout = asyncHandler(async (req, res) => {
    // we can also use res.clearCookies()
    res.cookie('token', null, {
        expires :new Date(Date.now()),
        httpOnly :true
    })
    res.status(200).json({
        sucess:true,
        message: `Logged out`
    })
});