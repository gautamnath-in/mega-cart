import mongoose from "mongoose";

import AuthRoles from '../utils/authRoles';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Name is Required"],
            maxLength: [50, "Name must be less than 50"]
        },
        email: {
            type: String,
            require: [true, "Email is Required"],
            unique: true
        },
        password: {
            type: String,
            require: [true, "Password is Required"],
            minLength: [8, "Password must be at least8 Characters"],
            select: false //wont be sent to FrontEnd
        },
        role: {
            type: String,
            enum: Object.values(AuthRoles), //returns array of values
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema); //users in mongo