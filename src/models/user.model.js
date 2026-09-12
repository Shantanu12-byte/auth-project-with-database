import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required: [true, "username is required"],
    unique: [true, "username must be unique"]
  },

    email:{
      type: String,
      require: [true, "email is required"],
      unique: [true,"email must be unique"]
    },
     password:{
      type:String,
      required: [true, "password is required"]
     }
})
  
const  usermodel  = mongoose.model("users", userSchema);
export default usermodel;