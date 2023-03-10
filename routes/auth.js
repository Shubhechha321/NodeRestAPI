const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    const result = bcrypt.compareSync(req.body.password, user.password);
    if (result) {
      const accessToken = sign({ result: user }, process.env.JSON_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = sign(
        { result: user },
        process.env.JSON_REFRESH_KEY,
        {
          expiresIn: "7d",
        }
      );
      return res.json({
        success: 1,
        message: "Logged in successfully",
        accessToken,
        refreshToken,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;