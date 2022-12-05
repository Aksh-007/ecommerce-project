import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        userName :{
            type:String,
            required:[true, "User name is required"],
            maxlength:[50, "Name not be exceed more than 50 character"],
            trim:true
        },
        

    }
)