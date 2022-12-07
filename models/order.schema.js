import mongoose from "mongoose";
import orderStatus from "../utility/orderStatus";
import paymentMode from "../utility/paymentMode";

const orderSchema = mongoose.Schema(
    {
        products :{
            type:[
                {
                    productId:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"Product",
                        required:true
                    },
                    count:Number,
                    price:Number
                }
            ],
            required:true
        },
        address:{
            type:Number,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        phoneNumber :{
            type:Number,
            required:true
        },
        amount :{
            type:Number,
            required:true
        },
        coupon:String,
        transactionId:String,
        orderStatus:{
            type:String,
            // we are extracting values from orderStatus object like ORDERED or SHIPPING
            enum: Object.values(orderStatus),
            default:orderStatus.ORDERED
        },
        //pymentMode:UPI, creaditcard or wallet,COD
        paymentMode:{
            type:String,
            enum:Object.values(paymentMode),
            default:paymentMode.COD
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model('Order', orderSchema);