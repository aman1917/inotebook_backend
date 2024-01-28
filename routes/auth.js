const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
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
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ errors: "Sorry this email already exists" });
    }
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // .then((user) => res.json(req.body))
    // .catch((err) => {
    //   console.log(err);
    //   res.json({ error: "Please Enter unique value for Email", message: err.message});
    // });
    res.json({ meassage: "User Created" });
  }
);

module.exports = router;
