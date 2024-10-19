const mongoose = require("mongoose");
const { title } = require("process");

const notificationSchema = mongoose.Schema(
  {
    userTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserToken",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports.notification = mongoose.model(
  "Notification",
  notificationSchema
);
