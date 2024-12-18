const express = require("express");
const userTokenRouter = express.Router();

const { createToken, sendNotification } = require("../controllers/userTokenController");

userTokenRouter.post("/createUserToken", createToken);
userTokenRouter.post("/sendnotification", sendNotification);

module.exports = userTokenRouter;
