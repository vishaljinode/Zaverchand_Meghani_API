const { Timestamp } = require("firebase-admin/firestore");
const mongoose = require("mongoose");

const userTokenSchema = mongoose.Schema({
  fcm_token: {
    type: String,
    required: true,
  },
  device_id: {
    type: String,
    required: true,
  },
},{timestamps : true});

module.exports.userToken = mongoose.model("UserToken",userTokenSchema)
