const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// it has , name email password image
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, 
  },
  image: {
    type: String,
     default: 'https://up.yimg.com/ib/th?id=OIP.PoS7waY4-VeqgNuBSxVUogAAAA&pid=Api&rs=1&c=1&qlt=95&w=114&h=114'
  },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPass){
  return await bcrypt.compare(enteredPass, this.password);
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;