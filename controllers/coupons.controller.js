import asyncHandler from "../services/asyncHandler.js";
import customError from "../utility/customError.js";
import couponModel from '../models/coupon.schema.js'


/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/



/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/


/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/
export const deleteCoupon = asyncHandler(async (req, res) => {
    const couponId = req.params;
    const deletedCoupon = await couponModel.findByIdAndDelete({
        couponId
    });

    if (!deletedCoupon) {
        throw new customError(`No coupon available `, 404)
    }

    res.status(200).json({
        sucess:true,
        deletedCoupon
    })
});


/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getAllCoupon = asyncHandler(async (req, res) => {
    const allCoupons = await couponModel.find({});

    if (!allCoupons) {
        throw new customError(`No coupon was found`, 404);
    }

    res.status(200).json({
        sucess: true,
        allCoupons
    });
});