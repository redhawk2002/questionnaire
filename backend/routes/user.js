const express = require("express");
const {
  welcome,
  signup,
  login,
  phonenumber,
  submitTest,
} = require("../controllers/user");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/welcome").get(welcome);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/edit/phonenumber").put(isAuthenticated, phonenumber);
router.route("/submit-test").post(isAuthenticated, submitTest);
module.exports = router;
