const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Static folders
// ===============================

app.use("/uploads", express.static("uploads"));
app.use("/enhanced", express.static("enhanced"));

// ===============================
// Test route
// ===============================

app.get("/", (req, res) => {
  res.send("Photo Enhancement Backend is Running 🚀");
});

// ===============================
// API Routes
// ===============================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/image",
  require("./routes/imageRoutes")
);

app.use(
  "/api/history",
  require("./routes/historyRoutes")
);

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // Start server after MongoDB connects
    app.listen(5000, () => {
      console.log(
        "🚀 Server running on http://localhost:5000"
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);
  });