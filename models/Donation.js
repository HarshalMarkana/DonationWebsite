const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationObj = {
    userId:{type: String, require:true},
    email: {type: String, require:true},
    name: {type: String, require:true},
    reason: {type: String, require:true},
    contact: {type: String, require:true},
    target:  {type:Number,require:true},
    received:{type:Number, require:true},
    //dateRegistered: {type: Date, default: Date.now()}
};

const donationSchema = new Schema(DonationObj,{timestamps:true});
const Donation = mongoose.model("donation",donationSchema);

 
module.exports = Donation;