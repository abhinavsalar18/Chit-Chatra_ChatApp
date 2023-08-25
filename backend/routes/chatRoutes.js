const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const router = express.Router();
const {accessChats, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController"); 

router.route("/").post(protect, accessChats);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;