import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import Camp from "../models/Camp.js";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const RESET = args.includes("--reset");

const file = new URL("../data/sampleCamps.json", import.meta.url);
const camps = JSON.parse(fs.readFileSync(file, "utf-8"));

let invalid = 0;
for (const c of camps) {
  const err = new Camp(c).validateSync();
  if (err) {
    invalid++;
    console.error(`Invalid entry "${c.name}":`, err.message);
  }
}
if (invalid > 0) {
  console.error(`${invalid} invalid entries. Fix the JSON and try again.`);
  process.exit(1);
}

console.log(`Loaded ${camps.length} sample camps.`);

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
    const del = await Camp.deleteMany({});
    console.log(`Removed ${del.deletedCount} existing camp entries.`);
  }

  const ops = camps.map((c) => ({
    updateOne: {
      filter: { name: c.name, location: c.location, date: new Date(c.date) },
      update: { $set: { organizer: c.organizer } },
      upsert: true,
    },
  }));

  const res = await Camp.bulkWrite(ops);
  console.log(`Done. Added ${res.upsertedCount} new, updated ${res.modifiedCount} existing.`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}