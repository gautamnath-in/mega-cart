import { json } from 'express';
import User from '../models/user.schema';
import asyncHandler from '../services/asyncHandler';
import customError from '../utils/customError';

import mailHelper from '../utils/mailHelper';

export const cookieOptions = {
    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    httpOnly: true
    //could be used in a separate file in utils
}

/**

* @SIGNUP
* @route http://localhost:5000/api/auth/signup
* @description User signup controller for creating new user
* @parameters name, email, password
* @return User Object

**/

export const signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new customError('Please fill all the fields', 400)
    }

    //check if user exists

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new customError('User already exists', 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJwtToken() //imp ->these methods are available to the obj of Schema, not the imported model
    user.password = undefined
    //but we already made password:{select:false} during Query [[here its returning from line 36 create]]

    res.cookie("token", token, cookieOptions)
    // res.cookie("string name of the cokkie", value from line 42, cookieOptions from lone 5) from express

    res.status(200, json({
        success: true,
        token,
        user
    }))

})

/**

* @LOGIN
* @route http://localhost:5000/api/auth/login
* @description User login controller for login user
* @parameters  email, password
* @return User Object

**/

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError('Please fill all the fields', 400)
    }

    const user = User.findOne({ email }).select('+password');

    if (!user) {
        throw new customError('Invalid User', 400)
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        const token = user.getJwtToken();
        token.password = undefined;
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    throw new customError('Invalid Credentials - password', 400);
})

/**

* @LOGOUT
* @route http://localhost:5000/api/auth/logout
* @description User logout by clearing user cookies
* @parameters
* @return success message

**/

export const logout = asyncHandler(async (_req, res) => { //_req -> coz not used(or pvt to just say)

    // res.cleaeCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

/**

* @Forgot Password
* @route http://localhost:5000/api/auth/password/forgot
* @description User will submit email and we will generate a token
* @parameters email
* @return success message - email sent

**/
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = User.findOne({ email });
    //TODO: Check email for null or ""
    if (!user) {
        throw new customError('User Not found', 404)
    }

    const resetToken = user.generateForgotPasswordToken();
    //save to DB
    // user.save() //this will demand all the vaildation fields

    await user.save({ validateBeforeSave: false })

    //send user the email

    const resetURL =
        // `https://gautamnath.in` from express below
        `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;

    const text = `Your Password reset URL is \n\n ${resetURL}`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email for website",
            text: text
        })

        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email}`
        })
    } catch (error) {
        //roll-back clear fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        throw new customError(error.message || 'Email was not sent', 500);

    }
});