import { json } from 'express';
import User from '../models/user.schema';
import asyncHandler from '../services/asyncHandler';
import customError from '../utils/customError';

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

    const existingUser = await User.findOne({email})

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