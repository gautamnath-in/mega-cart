import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Name is Required"],
            maxLength: [50, "Name must be less than 50"]
        }
    }
)