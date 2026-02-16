const express = require("express");
const {protect, authorize} = require("../middleware/auth");
const {getUser,getAllUsers,updateUser, deleteUser} = require("../controllers/user");
const router = express.Router();

router.use(protect);
router.use(authorize("admin"));


router.get("/",  getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id",deleteUser);

module.exports = router;