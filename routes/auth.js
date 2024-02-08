const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const JWT_SCRETE = "AmanIsKing";

//Route1: Create user using : POST "/api/auth/createuser".Create user

router.post(
  "/createuser",
  [
    body("name", "Enter Valid Name").isLength({ min: 2 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter Atleast 5 Characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //If error occurs,return the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }
    //check weather the user with this email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, errors: "Sorry this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      //generate jwt token with id
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SCRETE);
      success = true;
      console.log(authtoken);
      // res.json({ meassage: "User Created" });
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.meassage);
      res.status(500).json("Some Error Occurs");
    }
  }
);

//Route2: Authentication user using : POST "/api/auth/login" No Login Required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //If error occurs,return the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log("Email is Empty");
      return res.status(400).json({ success, errors: result.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      //if user not exists
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please Login with Correct Cerdentials" });
      }
      //if password & confirm password not same
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please Login with Correct Cerdentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SCRETE);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.meassage);
      res.status(500).json(success, "Internal Server Error");
    }
  }
);

//Route3: get Logged in User Details : POST "/api/auth/getuser" No Login Required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.meassage);
    res.status(500).json("Internal Server Error");
  }
});
module.exports = router;
