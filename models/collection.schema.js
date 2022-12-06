import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
    {
        categoryName:{
            type:String,
            required:[true, "Please provide a category Name"],
            trim:true,
            maxLength:[120, "Category Name should not be more than 120 character"]
        },
    },
    {
        timestamps:true
    }

);

export default mongoose.model('Collection', collectionSchema);