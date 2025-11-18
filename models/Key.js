const mongoose = require("mongoose");

const KeySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },

    // 🔥 NEW FEATURES
    hwidLock: { type: Boolean, default: true },    // Enable/disable HWID lock
    maxDevices: { type: Number, default: 1 },      // Allowed number of devices
    hwids: { type: [String], default: [] },        // Stored HWIDs for this key
    devices: [
    {
        hwid: String,
        ip: String,
        lastLogin: Number
    }
]

});

module.exports = mongoose.model("Key", KeySchema);
