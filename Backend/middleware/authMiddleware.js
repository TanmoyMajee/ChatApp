const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const userModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
  try{
    // extract token from header as head will be like this "Bearer <token>" so we will split it and get the
    // token from the second index
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // here we pass the user to the req.user so that we can access it in the controller,&& without the password
    req.user = await userModel.findById(decoded.id).select('-password');
    next();
  }catch(error){
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token not valid');
  }
}else{
  res.status(401);
  throw new Error('Not authorized, no token');
}});

module.exports = protect;

//  This is how the frontend code will look like ,
//  we will access the token from the local storage and pass it to the getAllUsers function through headers as shown below:
// import axios from 'axios';
// const getAllUsers = async (token) => {
//   try {
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     const response = await axios.get('/api/users/allusers', config);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw error;
//   }
// };