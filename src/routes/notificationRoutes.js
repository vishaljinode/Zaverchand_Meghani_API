const express = require('express');
const notificationRouter  = express.Router();

const { sendNotification } = require('../controllers/notificationController');

notificationRouter.post('/send-notification',sendNotification);



module.exports = notificationRouter