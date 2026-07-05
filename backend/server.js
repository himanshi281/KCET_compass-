const authRoutes =
  require("./routes/authRoutes");

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();



const collegeRoutes =
  require("./routes/collegeRoutes");



const app = express();



// ✅ MIDDLEWARE

app.use(cors({
  origin: ["https://kcetcompass.vercel.app", "http://localhost:5173", "http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());



// ✅ ROUTES

app.use(
  "/api/colleges",
  collegeRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

// ✅ CONNECT MONGODB

mongoose.connect(process.env.MONGO_URI)

  .then(() => {

    console.log("✅ MongoDB Connected");

  })

  .catch((error) => {

    console.log(error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;