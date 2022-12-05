import mongoose from "mongoose";
import authRoles from "../utility/authRoles"

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
        timestamps:true
    }
);

export default  mongoose.model("User", userSchema);