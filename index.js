const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const adminLoginRoutes = require("./routes/adminLogin");
app.use("/admin", adminLoginRoutes);



// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
