const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SCRETE = "AmanIsKing";

//Create user using : POST "/api/auth".Create user

router.post(
  "/createuser",
  [
    body("name", "Enter Valid Name").isLength({ min: 2 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter Atleast 5 Characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If error occurs,return the error
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    //check weather the user with this email already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ errors: "Sorry this email already exists" });
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
      // console.log(jwtData);
      // res.json({ meassage: "User Created" });
      res.json({ authtoken });
    } catch (error) {
      console.log(error.meassage);
      res.status(500).json("Some Error Occurs");
    }
  }
);

module.exports = router;
