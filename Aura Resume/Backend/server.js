const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");

dotenv.config();

require("./config/passport");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */

// CORS (frontend connection)
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Session (must be before passport.session)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "aura_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

/* ================= STATIC FRONTEND ================= */

// Serve frontend files
app.use(
  express.static(
    path.join(__dirname, "../Frontend/public"),
    {
      index: false,
    }
  )
);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);

// Home route (optional fallback)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/login.html"));
});

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
