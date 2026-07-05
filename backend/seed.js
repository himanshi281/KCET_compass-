const mongoose = require("mongoose");

require("dotenv").config();

const College =
  require("./models/College");

const colleges =
  require("./data/colleges.json");



mongoose.connect(process.env.MONGO_URI)

.then(async () => {

  console.log("✅ MongoDB Connected");



  // DELETE OLD DATA

  await College.deleteMany();



  // INSERT NEW DATA

  await College.insertMany(
    colleges
  );



  console.log(
    "🔥 Colleges Inserted Successfully"
  );



  process.exit();

})

.catch((error) => {

  console.log(error);
});