const userTokenModel = require("../models/userTokenSchema");
const UserToken = userTokenModel.userToken;

const createToken = async (req, res) => {
  try {
    const device_id = req.body.device_id;
    const fcmtoken = req.body.fcmtoken;

    if(!device_id){
      return res.status(400).json({message: "Device ID is required"})
    }
    if(!fcmtoken){
      return res.status(400).json({message: "FCM Token is required"})
      }
      

    // Use findOneAndUpdate with upsert option
    const userToken = await UserToken.findOneAndUpdate(
      { device_id: device_id }, // Filter condition
      { fcm_token: fcmtoken }, // Update data
      { new: true, upsert: true } // Options: return new doc and upsert
    );

    if (userToken.isNew) {
      return res.json({ message: "Token created successfully" });
    } else {
      return res.json({ message: "Token updated successfully" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { createToken };
