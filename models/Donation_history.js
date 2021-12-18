const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donation_history = {
    doneeId:{type: String, require:true},
    donationId:{type: String, require:true},
    name: {type: String, require:true},
    amount: {type: Number, require:true},
    dateRegistered: {type: Date, default: Date.now()}
};

const historySchema = new Schema(donation_history,{timestamps:true});
const History = mongoose.model("donation_history",historySchema);

 
module.exports = History;