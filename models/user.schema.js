import mongoose from "mongoose";
import authRoles from "../utility/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index"


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

    // we are checking if password field is not there then it will ends up here and if any other middleware we want to add then we ca do that 
    if (!this.isModified("password")) {
        return next();
    }
    // if password field is available then go and encrypt the password 
    this.password = await bcrypt.hash(this.password, 10)
    next();
})


// add more features directl to schema
//using ptotype injection 

userSchema.methods = {
    //method for compare password
    //added method so we can reuse whenever we want to compare the password
    comparePassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generate JWT token
    getJwtToken: function () {
        return JWT.sign(
            {
                //first is variable and another is coming from databse
                userId: this._id,
                role: this.role
            },
            //secret key
            config.JWT_SECRET,
            //expiry time
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    },

    //genearate Forgot password string using crypto package
    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes(20).toString('hex')

        //step 1 - save to database
        //first encrypting the token using crypto 
        // this is a database call this.forgotPasswordToken is from line 34 so whenevr we are calling this its automatically update in databse
        this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(forgotToken)
            .digest("hex")

            // 20 * 60 * 1000 = 20minutes
            // updating forgotPasswordExpiry date in database
        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;


        // step 2 - return value to user
        return forgotToken;
    }

}


export default mongoose.model("User", userSchema);