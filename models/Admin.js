const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password_hash: String,
    role: { type: String, default: "admin" }, // admin or superadmin
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admin", AdminSchema);
