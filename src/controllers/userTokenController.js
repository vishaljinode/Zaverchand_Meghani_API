const userTokenModel = require("../models/userTokenSchema");
const UserToken = userTokenModel.userToken;

const createToken = async (req, res) => {
  try {

    console.log(" req.body", req.body)
    const device_id = req.body.device_id;
    const fcmtoken = req.body.fcmtoken;

    if(!device_id){
      console.log("Device ID is required")
      return res.status(400).json({message: "Device ID is required"})
    }
    if(!fcmtoken){
      console.log("FCM Token is required")
      return res.status(400).json({message: "FCM Token is required"})
      }


    // Use findOneAndUpdate with upsert option
    const userToken = await UserToken.findOneAndUpdate(
      { device_id: device_id }, // Filter condition
      { fcm_token: fcmtoken }, // Update data
      { new: true, upsert: true } // Options: return new doc and upsert
    );

    if (userToken.isNew) {
      console.log("Token created successfully")
      return res.json({ message: "Token created successfully" });
    } else {
      console.log("Token updated successfully")
      return res.json({ message: "Token updated successfully" });
    }
  } catch (err) {
    console.error("Token error",err.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { createToken };
