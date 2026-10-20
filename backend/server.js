import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns";
import { connectDB } from "./config/connectDB.js";
import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donors.js";
import requestRoutes from "./routes/requests.js";
import bloodBankRoutes from "./routes/bloodbanks.js";
import campRoutes from "./routes/camps.js";

// =============================
// CONFIG
// =============================
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =============================
// INITIALIZE EXPRESS
// =============================
const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());

// =============================
// ROUTES
// =============================
app.get("/", (req, res) => {
  res.json({ message: "BloodConnect API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/bloodbanks", bloodBankRoutes);
app.use("/api/camps", campRoutes);

// =============================
// PORT
// =============================
const port = process.env.PORT || 5000;

// =============================
// START SERVER AFTER DB CONNECTS
// =============================
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
