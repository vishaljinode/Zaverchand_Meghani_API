const express = require("express");
const userTokenRouter = express.Router();

const { createToken } = require("../controllers/userTokenController");

userTokenRouter.post("/createUserToken", createToken);

module.exports = userTokenRouter;
