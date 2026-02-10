const express = require("express");
const router = express.Router();
const { register, login, getUser} = require("../controllers/auth");
const {protect} = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getUser);

module.exports = router;
