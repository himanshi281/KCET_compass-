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

app.use(cors());

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

  app.listen(5000, () => {

    console.log(
      "🚀 Server running on port 5000"
    );
  });

})

.catch((error) => {

  console.log(error);
});