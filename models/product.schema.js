import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        productName :{
            type:String,
        }
    }
);

export default mongoose.model('Product', productSchema);