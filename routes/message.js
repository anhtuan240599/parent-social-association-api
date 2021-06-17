const express = require("express");
const router = require("express-promise-router")();

const messageController = require("../controllers/message.controller");

const upload = require("../middlewares/upload-photo");

const verifyToken = require("../middlewares/verify-token");

router
  .route("/:userID")
  .post(verifyToken, upload.single("image", 1), messageController.sendMessage)
  .get(verifyToken, messageController.getMessage);

module.exports = router;
