import mongoose from "mongoose";

import AuthRoles from '../utils/authRoles';

import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

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

//challange 1 - encrypt password -- hooks
userSchema.pre('save', async function (next) { //i.e., before save do the fn tasks

    if (!this.modified("passowrd")) return next(); //if not new entry

    this.password = await bcrypt.hash(this.password, 10) //if new entry like new password..

    next();
})

export default mongoose.model('User', userSchema); //users in mongo