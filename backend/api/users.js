const express = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const router = express.Router();

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password } = req.body;
    const user = new User({
      name,
      username,
      password,
    });
    try {
      await user.save();
      res.send("success");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// POST - api/users/login
// Login a user and get a token
// PUBLIC

// GET - api/users/
// Get all users
// PUBLIC

// GET - api/users/:id
// Get a user by id
// PUBLIC

// GET - api/users/me
// Get user by a token
// PRIVATE

module.exports = router;
