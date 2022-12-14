import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    count: Number,
                    price:Number,
                },
            ],
            reuired: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        coupon: String,
        transactionId: String,
        status: {
            type: String,
            enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "ORDERED" //improve this -use AuthRoles
        },
        //paymentMode: UPI, Creditcard or wallet, COD
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Order',orderSchema)
