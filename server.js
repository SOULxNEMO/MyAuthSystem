require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

app.listen(3000, () => console.log("Server running on port 3000"));

