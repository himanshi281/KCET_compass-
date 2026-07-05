const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { signup, login, getProfile, toggleLike, updateAvatar } = require("../controllers/authController");

// ==========================================
// ROUTES
// ==========================================

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getProfile);
router.post("/like/:collegeId", auth, toggleLike);
router.put("/avatar", auth, updateAvatar);


module.exports = router;