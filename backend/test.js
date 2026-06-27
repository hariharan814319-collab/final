const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);

  const Test = mongoose.model(
    "Test",
    new mongoose.Schema({
      name: String,
    })
  );

  await Test.create({
    name: "Hospital Test",
  });

  console.log("Document Inserted");
  process.exit();
}

test();