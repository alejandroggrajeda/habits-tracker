var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newwUser = new User({ username, password: hashedPassword });
    await newwUser.save();

    res.status(201).json({ message: "User registered succesfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server error.", description: error.toString() });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("habitToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User logged in successfully!", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server error.", description: error.toString() });
  }
});

module.exports = router;
