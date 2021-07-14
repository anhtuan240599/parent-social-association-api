const express = require("express");
const router = require("express-promise-router")();
const upload = require("../middlewares/upload-photo");

const Group = require("../controllers/group.controller");

const verifyToken = require("../middlewares/verify-token");

router
  .route("/decks/:groupID")
  .post(verifyToken, upload.array("image", 20), Group.newDeckGroup)
  .get(verifyToken, Group.getDeckGroup);

router.route("/deck/:deckID").get(verifyToken, Group.getOneDeckGroup);

router.route("/:groupID/:deckID").delete(verifyToken, Group.deleteDeckGroup);

router
  .route("/:groupID")
  .post(verifyToken, Group.joinGroup)
  .get(verifyToken, Group.getOneGroup)
  .patch(verifyToken, upload.single("image", 1), Group.updateGroup)
  .delete(verifyToken, Group.deleteGroup);

router.route("/:groupID/users").get(verifyToken, Group.getUsersOfGroup);

router
  .route("/")
  .get(verifyToken, Group.getGroup)
  .post(verifyToken, upload.single("image", 20), Group.newGroup);

router.route("/users").get(verifyToken, Group.getAllUsersOfAllGroup);

router
  .route("/teachers")
  .post(verifyToken, upload.single("image", 1), Group.newTeacherGroup);

module.exports = router;
