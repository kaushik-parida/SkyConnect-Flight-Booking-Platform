const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/users", jwtMiddleware, authController.getAllUsers);

module.exports = router;