const express = require("express");
const { handleUserSignup, handlelogin } = require("../controllers/user");
const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handlelogin);

module.exports = router;
