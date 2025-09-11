// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute"); // match your filename
const submissionRoutes = require("./routes/submissionRoutes");
const path = require("path");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Global CORS for API endpoints
app.use(cors());

// Serve uploads with Access-Control-Allow-Origin header
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
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
