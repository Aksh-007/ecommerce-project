import userModel from "../models/user.schema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";
import cookiesOptions from "../utility/cookiesOptions";
import mailHelper from "../utility/mailHelper";
import crypto from "crypto";
import { json } from "body-parser";


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
    const user = await userModel.findOne({ email }).select('+password');

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

// we are not using any request so that we are using _req
export const logout = asyncHandler(async (_req, res) => {
    // we can also use res.clearCookies()
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        sucess: true,
        message: `Logged out`
    })
});



/**************************************************************************
@FORGT_PASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description User will submit email and we will genereate a token
@parameters email 
@returns success message- password reset email sent 
***************************************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new customError('please enter the email', 404)
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new customError('user not found', 404)
    }

    const resetToken = userModel.generateForgotPasswordToken();
    //while saving user we need every valdation in model so
    await user.save({ validateBeforeSave: false });

    // now creating reset url
    // `https://hitesh.com`
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${resetToken}`
    //here you can see reset url
    console.log(resetUrl);
    const text = `your password reset link url is \n\n ${resetUrl} \n\n`
    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email ",
            text: text,
        })
        res.status(200).json({
            sucess: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        // this is main process in mailverification if we are not able to sent email 
        // so we are roll back the change that is forgotPasswordToken , forgotPasswordExpiry so making them undefined
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        //saving the changes in databse
        await user.save({ validateBeforeSave: false });
        throw new customError(err.message || `email was not sent`, 500);




    }

});


/**************************************************************************
@RESET_PASSWORD
//here we are taking :resetPasswordToken bcoz we are sending resetToken
@route http://localhost:4000/api/auth/password/reset/:resetToken
@description User will be able to reset password based on url token
@parameters token from url , password and confirm password
@returns User object 
***************************************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
   // grabing token from url
    const {token:resetToken}= req.params
    const{password, confirmPassword} = req.body
    // token is encrypted so decrypting 
   const resetPasswordToken =  crypto
    .createHash('SHA256')
    .update(resetToken)
    .digest('hex')

    //now we are finding based on forgotPasswordToken
    //userModel.findOne ({email : email})
    const user = await userModel.findOne({
        forgotPasswordToken : resetPasswordToken,
        forgotPasswordExpiry:{$gt : Date.now()}
    });

    if (!user) {
        throw new customError(`Password token is invalid or expired`, 400)
    }
    //checking if password and confirm password is same
    if (password !== confirmPassword) {
        throw new customError('password and confirm password doesnt match', 400)
    }

    user.password = password
    // no we are saving forgotPasswordToken,forgotPasswordExpiry is undefined in database bcs dont want to store junk 
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    // now saving it to database
    await user.save();
    //  create a token and send as response
    const token = user.getJwtToken();
    user.password = undefined
    
    res.cookie('token', token, cookiesOptions);
    res.status(200),json({
        sucess:true,
        user
    })
})

