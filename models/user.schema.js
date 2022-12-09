import mongoose from "mongoose";

import AuthRoles from '../utils/authRoles';

import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

import config from "../config/index";

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

    if (!this.isModified("passowrd")) return next(); //if not new entry

    this.password = await bcrypt.hash(this.password, 10) //if new entry like new password..

    next();
})

// add more features directly to our Schema
userSchema.methods = {
    //compare Password
    comparePassword : async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    },

    //generate JWT Token
    getJwtToken: function () {
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,// 'good-secret'
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    },

    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes(20).toString('hex');

        // step 1 -- save to DB
        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest("hex");

        this.forgotPasswordExpiry = Date.now() + 20 + 60 * 1000

        // step 2 -- return value to user
        return forgotToken; //time is already in DB
    }
}

export default mongoose.model('User', userSchema); //users in mongo