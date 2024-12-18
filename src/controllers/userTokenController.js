const userTokenModel = require("../models/userTokenSchema");
const UserToken = userTokenModel.userToken;
const { firebaseAdmin } = require('../config/firebaseConfig');


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

const sendNotification = async (req, res) => {
  const { title, description } = req.body;
  
  // Check if title and description are provided
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  const messageBase = {
    webpush: {
      notification: {
        title: title,
        body: description,
        // icon: iconUrl, // Use the resolved iconUrl if needed
      },
    },
  };

  try {
    // Get user tokens from the database
    const userTokens = await UserToken.find({});
    
    if (userTokens.length === 0) {
      console.error("No FCM tokens found.");
      return res.status(404).json({ message: "No users to notify." });
    }

    // Send notifications to each user
    const notificationPromises = userTokens.map(async (item) => {
      if (!item.fcm_token) {
        console.warn("Empty FCM token for user:", item.id);
        return;
      }

      const payload = { ...messageBase, token: item.fcm_token };

      try {
        // Send the notification via Firebase Cloud Messaging
        const response = await firebaseAdmin.messaging().send(payload);
        console.log("Notification sent successfully:", response);
      } catch (error) {
        console.error("Error sending FCM message:", error);
      }
    });

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);

    return res.status(200).json({ message: "Notifications sent successfully." });
  } catch (error) {
    console.error("Error in sending notifications:", error);
    return res.status(500).json({ message: "Error in sending notifications." });
  }
};



module.exports = { createToken, sendNotification };
