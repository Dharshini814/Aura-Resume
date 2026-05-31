const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  signup,
  login,
} = require("../controllers/authController");

const router = express.Router();

/* ================= EMAIL AUTH ================= */

router.post("/signup", signup);

router.post("/login", login);

/* ================= MAGIC LINK ================= */

router.post(
  "/magic-link",
  async (req, res) => {

    try {

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email required",
        });
      }

      const user = await User.findOne({
        email,
      });

      if (!user) {

        return res.status(400).json({
          success: false,
          message:
            "No account found with this email",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Magic Link simulated successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

/* ================= FORGOT PASSWORD ================= */

router.post(
  "/forgot-password",
  async (req, res) => {

    try {

      const { email, newPassword } =
        req.body;

      if (!email || !newPassword) {

        return res.status(400).json({
          success: false,
          message:
            "Email and new password required",
        });
      }

      const user = await User.findOne({
        email,
      });

      if (!user) {

        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password = hashedPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

/* ================= GOOGLE LOGIN ================= */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect:
      "http://localhost:5000/login.html",
  }),

  (req, res) => {

    res.redirect(
      "http://localhost:5000/index.html"
    );
  }
);

module.exports = router;