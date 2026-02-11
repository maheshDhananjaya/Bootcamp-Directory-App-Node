const express = require("express");
const router = express.Router();
const { register, login, getUser, updateUser,updatePassword, forgotPassword,restPassword} = require("../controllers/auth");
const {protect} = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getUser);
router.put("/updateDetail", protect, updateUser);
router.put("/updatePassword", protect, updatePassword);
router.post("/forgot-password",  forgotPassword);
router.put("/reset-password/:resetToken", restPassword)

module.exports = router;
