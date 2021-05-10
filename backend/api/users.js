const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.jwt;
const auth = require("../middleware/m_auth");
// Model
const User = require("../models/User");

/*
@ROUTE - api/users
@DESC  - All user related routes
*/

// POST - api/users
// Regiter a user and get a token
// PUBLIC
router.post(
  "/",
  check("username", "Username is Required").notEmpty(),
  check("password", "Password should be 6 or more characters").isLength({
    min: 6,
  }),
  async (req, res) => {
    //checking client input erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password } = req.body;

    try {
      const checkUser = await User.findOne({ username });

      if (checkUser) {
        return res.status(400).send("Username already taken");
      }

      const user = new User({
        name,
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtKey, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

// POST - api/users/login
// Login a user and get a token
// PUBLIC
router.post(
  "/login",
  check("username", "Username is Required").notEmpty(),
  check("password", "Password should be 6 or more characters").isLength({
    min: 6,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: "invalid username" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "invalid password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtKey, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

// GET - api/users/
// Get all users
// PUBLIC
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// GET - api/users/:username
// Get a user by username
// PUBLIC
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});

// GET - api/users/me
// Get user by a token
// PRIVATE

module.exports = router;
