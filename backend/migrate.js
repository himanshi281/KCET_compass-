const mongoose = require("mongoose");
require("dotenv").config();

const College = require("./models/College");
const User = require("./models/User");

async function migrateData() {
  const localUri = process.env.LOCAL_MONGO_URI;
  const atlasUri = process.env.MONGO_URI;

  if (!localUri || !atlasUri) {
    console.error("❌ Please provide both LOCAL_MONGO_URI and MONGO_URI in your .env file!");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to Local MongoDB...");
    const localConnection = await mongoose.createConnection(localUri).asPromise();
    console.log("✅ Connected to Local MongoDB");

    // Load models on the local connection
    const LocalCollege = localConnection.model("College", College.schema);
    const LocalUser = localConnection.model("User", User.schema);

    console.log("⏳ Fetching data from Local Database...");
    const colleges = await LocalCollege.find({}).lean();
    const users = await LocalUser.find({}).lean();
    
    console.log(`📦 Found ${colleges.length} colleges.`);
    console.log(`📦 Found ${users.length} users.`);

    console.log("\n⏳ Connecting to MongoDB Atlas...");
    const atlasConnection = await mongoose.createConnection(atlasUri).asPromise();
    console.log("✅ Connected to MongoDB Atlas");

    // Load models on the Atlas connection
    const AtlasCollege = atlasConnection.model("College", College.schema);
    const AtlasUser = atlasConnection.model("User", User.schema);

    console.log("⏳ Clearing existing data in Atlas to prevent duplicates...");
    await AtlasCollege.deleteMany({});
    await AtlasUser.deleteMany({});

    console.log("⏳ Inserting data into Atlas...");
    if (colleges.length > 0) {
      await AtlasCollege.insertMany(colleges);
      console.log(`✅ Successfully inserted ${colleges.length} colleges.`);
    }
    
    if (users.length > 0) {
      await AtlasUser.insertMany(users);
      console.log(`✅ Successfully inserted ${users.length} users.`);
    }

    console.log("\n🎉 Migration completed successfully!");

    await localConnection.close();
    await atlasConnection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
