import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import BloodBank from "../models/BloodBank.js";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const RESET = args.includes("--reset");

const file = new URL("../data/maharashtraBloodBanks.json", import.meta.url);
const banks = JSON.parse(fs.readFileSync(file, "utf-8"));

let invalid = 0;
for (const b of banks) {
  const err = new BloodBank(b).validateSync();
  if (err) {
    invalid++;
    console.error(`Invalid entry "${b.name}":`, err.message);
  }
}
if (invalid > 0) {
  console.error(`${invalid} invalid entries. Fix the JSON and try again.`);
  process.exit(1);
}

const cities = [...new Set(banks.map((b) => b.city))];
const withPins = banks.filter((b) => typeof b.lat === "number" && typeof b.lng === "number").length;
console.log(`Loaded ${banks.length} blood banks across ${cities.length} cities: ${cities.join(", ")}`);
console.log(`Map pins available for ${withPins} of ${banks.length}.`);

if (DRY) {
  console.log("Dry run OK - nothing was written to the database.");
  process.exit(0);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Make sure backend/.env exists and has MONGO_URI set.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected to database:", mongoose.connection.name);

  if (RESET) {
    const del = await BloodBank.deleteMany({});
    console.log(`Removed ${del.deletedCount} existing blood bank entries.`);
  }

  const ops = banks.map((b) => {
    const set = { address: b.address, phone: b.phone };
    if (typeof b.lat === "number" && typeof b.lng === "number") {
      set.lat = b.lat;
      set.lng = b.lng;
      if (b.geoAccuracy) set.geoAccuracy = b.geoAccuracy;
    }
    return {
      updateOne: {
        filter: { name: b.name, city: b.city },
        update: { $set: set },
        upsert: true,
      },
    };
  });

  const res = await BloodBank.bulkWrite(ops);
  console.log(`Done. Added ${res.upsertedCount} new, updated ${res.modifiedCount} existing.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}