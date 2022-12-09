import userModel from "../models/user.schema";
import JWT from 'jsonwebtoken';
import asyncHandler from "../services/asyncHandler";
import customError from "../utility/customError";
import config from "../config";


export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token;

    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split('')[1]
    }

    if (!token) {
        throw new customError('Not authorise to access this route, 401');
    }

    try {

        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);
        //from payload/data grab the _id of user and find user based on id,set this in req.user
        // when we can findbyId we can pass all the needed field : name email id
        req.user = await userModel.findById(decodedJwtPayload._id, "userName email role")
        next()
    } catch (error) {
        throw new customError('Not authorise to access this route, 401');
    }
})