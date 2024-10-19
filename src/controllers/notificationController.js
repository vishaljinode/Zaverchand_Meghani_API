const notificationModel = require("../models/notificationSchema");
const userTokenModel = require("../models/userTokenSchema");

const Notification = notificationModel.notification;
const UserToken = userTokenModel.userToken;

const { firebaseAdmin } = require("../config/firebaseConfig");
const { Expo } = require("expo-server-sdk");
let expo = new Expo();

const sendNotification = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  // Fetch all user tokens
  const expoTokens = await UserToken.find();

  if (expoTokens.length) {
    try {
      // Validate Expo tokens


      console.log("expoTokens------>",expoTokens)

      const validExpoTokens = expoTokens.filter((token) =>{
        console.log("Expo.isExpoPushToken(token.fcm_token):",Expo.isExpoPushToken(token.fcm_token))
      return  Expo.isExpoPushToken(token.fcm_token)
      }
        
      );

      if (validExpoTokens.length === 0) {
        return res.status(400).send("No valid Expo push tokens provided");
      }

      // Create messages for valid tokens
      const messages = validExpoTokens.map((token) => ({
        to: token,
        sound: "default",
        title: title,
        body: description,
      }));

      // Chunk the messages to avoid overloading the server
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          const receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error("Error sending Expo notifications:", error);
        }
      }

      res
        .status(200)
        .json({ success: true, message: "Notifications sent successfully." });
    } catch (error) {
      console.error("Error in sending notification:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error sending notification." });
    }
  } else {
    return res
      .status(404)
      .json({ success: false, message: "No tokens found." });
  }
};

module.exports = { sendNotification };
