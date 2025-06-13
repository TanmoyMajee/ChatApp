const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const getToken = require('../config/generateToken');
const admin =  require('../config/firebase-admin')
// import { compare } from 'bcryptjs';
const becrypt = require('bcrypt');
const UserModel = require('../models/userModel');

const registerFun = asyncHandler(async (req, res) => {
  const { name, email, password,pic } = req.body;

  if(!name || !email || !password || !pic){
    throw new Error('Please fill all the fields');
  }
  // console.log(name,email,password,pic)
  const userExist = await userModel.findOne({email});
    if(userExist){
      throw new Error('User already exist');
    }
    const salt = await becrypt.genSalt(10);
    const hashPassword = await becrypt.hash(password,salt);
    const newUser = await userModel.create({
      name,
      email,
      password:hashPassword,
      image:pic
  }); 
// console.log(newUser,"CREATED")
  if(newUser){
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.image,
      token:getToken(newUser._id)
    });}else{
      res.status(400);
      throw new Error('user not creted');
    }

});

const googleRegister = asyncHandler(async (req,res)=>{
  try {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid: googleId, email_verified } = decodedToken;

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email },
        { googleId }
      ]
    });


    // In your Google registration controller
    if (existingUser) {
      // Instead of returning an error, log the user in
      // const token = jwt.sign(
      //   { id: existingUser._id, isGoogleUser: true },
      //   process.env.JWT_SECRET,
      //   { expiresIn: '30d' }
      // );
      const token = getToken(existingUser._id)

      return res.json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        pic: existingUser.image,
        token,
        isGoogleUser: true,
        emailVerified: existingUser.emailVerified
      });
    }

    // Create new user
    const user = await UserModel.create({
      email,
      name,
      image: picture,
      googleId,
      emailVerified: email_verified,
      isGoogleUser: true,
      password: Math.random().toString(36).slice(-8)
    });
    // Generate JWT token
    // const token = jwt.sign(
    //   { id: user._id, isGoogleUser: true },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '30d' }
    // );
    const token = getToken(user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.image,
      token,
      isGoogleUser: true,
      emailVerified: user.emailVerified
    });

  } catch (error) {
    console.error('Google registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
})

const authuserFun=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    const userExist=await userModel.findOne({email});

// if (userExist && (await userExist.matchPassword(password))) { here why i cant use suer .mathpass fun directly ? 
// Great question! The reason you can't use User.matchPassword(password) directly is because matchPassword is an instance method, not a static method. Let me explain the difference and why this matters:
    if(userExist && (await userExist.matchPassword(password))){
      res.status(201).json({
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        pic: userExist.image,
        token:getToken(userExist._id)
      })
    }else{
      res.status(400);
      throw new Error('Invalid email or password');
    }
    
})

const googleLogin = asyncHandler(async (req,res)=>{
  try {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, uid: googleId } = decodedToken;

    // Find user
    const user = await UserModel.findOne({
      $or: [
        { email },
        { googleId }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found. Please register first.'
      });
    }
    // 5. Verify with data base Google id 
    if (user.googleId && user.googleId !== decodedToken.uid) {
      return res.status(401).json({ message: 'Invalid Google account' });
    }
    // Update last login and Google info
    user.lastGoogleLogin = new Date();
    user.googleId = googleId;
    await user.save();

    // Generate JWT token
    // const token = jwt.sign(
    //   { id: user._id, isGoogleUser: true },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '30d' }
    // );
    const token = getToken(user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.image,
      token,
      isGoogleUser: true,
      emailVerified: user.emailVerified
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
})

// api/users?name=ram&
let allusersFun = asyncHandler(async (req, res) => {
  // This code searches for users by name or email based on the "search" query parameter from the frontend.
// If a search value is provided, we assign the search value to the name and email fields using the $regex operator so that we can search for users by name or email. in database
// if the search value is not provided, then keyword will be an empty object
// The $or operator allows matching either the name or the email field. 
  const keyword = req.query.search ? 
{
  $or:[
    {name:{$regex:req.query.search,$options:'i'}},
    {email:{$regex:req.query.search,$options:'i'}}
  ]
}:{}
   // Ensure req.user is defined , user is logged in , only then we can access the users
   if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  // here we are finding all the users except the logged in user
  const users = await userModel.find(keyword).find({_id:{$ne:req.user._id}}).select('-password');
  res.json(users);
})



module.exports = { registerFun , authuserFun, allusersFun , googleLogin , googleRegister};


// asyncHandler is a middleware function that helps handle errors in asynchronous route handlers in Express.js. It automatically catches errors and passes them to the error-handling middleware, preventing the need for repetitive try-catch blocks.

// You can use asyncHandler to wrap your asynchronous functions. Here is how you can do it: