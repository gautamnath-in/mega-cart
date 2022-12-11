import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Provide a Product Name"],
            maxLength: [120, "Product Name should be max of 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Please Provide a Product Price"],
            maxLength: [5, "Product Price should not be more than 5 Digits"]
        },
        description: {
            type: String
            //use some form of Ediotrs from npm -- personal assignment
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId, //always same --for storing _id(s)
            ref: "Collection"
        }
    },
    {
        timestamps: true
    }

)

export default mongoose.model('Product',productSchema)