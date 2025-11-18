const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema({
    type: String,          // login, verify, admin-action, error
    user: String,          // username, userId or key
    action: String,        // description
    ip: String,
    hwid: String,
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoginLog", LoginLogSchema);
