const mongoose = require("mongoose");

const atlasFallbackHostnames = [
  "ac-eixeqry-shard-00-00.oo8bxic.mongodb.net:27017",
  "ac-eixeqry-shard-00-01.oo8bxic.mongodb.net:27017",
  "ac-eixeqry-shard-00-02.oo8bxic.mongodb.net:27017",
];

const atlasFallbackQuery = "authSource=admin&replicaSet=atlas-12xymu-shard-0&tls=true&retryWrites=true&w=majority&appName=Cluster0";

const buildFallbackUri = (primaryUri) => {
  try {
    const parsed = new URL(primaryUri.replace(/^mongodb\+srv:/, "http:"));
    const user = parsed.username;
    const password = parsed.password;
    const dbName = parsed.pathname.replace(/^\//, "");

    if (!user || !password || !dbName) {
      return primaryUri;
    }

    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${atlasFallbackHostnames.join(",")}/${dbName}?${atlasFallbackQuery}`;
  } catch (error) {
    return primaryUri;
  }
};

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Missing MONGO_URI in environment");
    }

    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", uri.replace(/mongodb\+srv:\/\/[^^]+@/, "mongodb+srv://<redacted>@"));

    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
      });
    } catch (err) {
      console.warn("Initial MongoDB Atlas connection failed:", err.message);

      if (err.code === "ECONNREFUSED" && err.syscall === "querySrv") {
        const fallbackUri = buildFallbackUri(uri);
        console.log("Attempting fallback MongoDB URI to bypass SRV DNS...");
        console.log("Fallback hosts:", atlasFallbackHostnames.join(","));

        await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 10000,
          family: 4,
        });
      } else {
        throw err;
      }
    }

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ Database Connection Error");
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;