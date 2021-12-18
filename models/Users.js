const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userObj = {
    googleId:{type: String, require:false},
    email: {type: String, require:true},
    name: {type: String, require:true},
    password: {type: String, require:false},
    mobile_no: {type: String, require:false}
    //dateRegistered: {type: Date, default: Date.now()}
};

const userSchema = new Schema(userObj,{timestamps:true});
const User = mongoose.model("user",userSchema);

 
module.exports = User;