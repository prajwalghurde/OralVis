// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // ensure this filename exists
const submissionRoutes = require("./routes/submissionRoutes");
const path = require("path");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Global CORS for API endpoints
app.use(cors());

// Ensure uploads folder exists (useful for local fallback)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads with Access-Control-Allow-Origin header (still useful for local fallback)
app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: function (res /*, filePath */) {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/submission", submissionRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
