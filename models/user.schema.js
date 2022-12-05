import mongoose from "mongoose";
import authRoles from "../utility/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
            maxlength: [50, "Name not be exceed more than 50 character"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be atleast 8 character"],
            // whenever we are sending the user there, we are sending password also so for not sending password to frontend whenever we are quering we select :false 
            select: false
        },
        role: {
            type: String,
            enum: Object.values(authRoles),
            default: authRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
    },
    {
        timestamps: true
    }
);

// challenge number 1 - encrypt the password
// use basic function 
//note: donot use arrow function here 
// this is middleware or hooks of mongoose whenever we calling save the password first encrypted and then it will save that why it is {Pre} hooks
userSchema.pre("save", async function (next) {
    
    // we are checking if password field is not there then it will ends up here and if any other middleware we want to learn then we ca do that 
    if (!this.modified("password")) {
        return next();
    }
    // if password field is available then go and encrypt the password 
    this.password = await bcrypt.hash(this.password, 10)
    next();
})





export default mongoose.model("User", userSchema);