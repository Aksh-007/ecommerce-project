import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxLength: [120, "Product name should be a max 120characters"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            maxLength: [5, "product price is not greater than 5 digit"]
        },
        productDescription: {
            type: String,
            //use some form of editior - personal assingment
        },
        // just a array of object
        productPhoto: [
            {
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        productStock: {
            type: Number,
            default: 0
        },
        productSold: {
            type: Number,
            default: 0
        },
        //WHAT WE ARE DOING -  each product should be a part of collection/category
        // I WANT TO STORE REFERNECE OF COLLECTION
        //REFERNECE OF ANOTHER SCHEMA
        // why we are doing bcos product is of different category like winter wear summer wear
        // category in phone like apple , samasung, nokia,xiaomi, poco
        collectionId: {
            // ObjectId is used to store ids 
            type: mongoose.Schema.Types.ObjectId,
            // refernece of another schema
            ref: "Collection"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Product', productSchema);