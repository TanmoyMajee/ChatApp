const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const connectDB = async () => {
  try{
    mongoose.connect(process.env.MONGO_URI, {
      // newurlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: true,
    });
    console.log(`MongoDB connected successfully in ${process.env.MONGO_URI} mode`);
  }
  catch (error) {
    console.error(`DataBase Connect  Error : ${error.message}`);
    // process.exit(1);
  }
};
module.exports = connectDB;