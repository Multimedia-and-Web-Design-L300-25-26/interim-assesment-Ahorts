const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Using POST as per standard REST practices for sending sensitive data
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", protect, authController.getProfile);
// Added update password route to see how it works with the protect middleware
router.patch("/update-password", protect, authController.updatePassword);

module.exports = router;
