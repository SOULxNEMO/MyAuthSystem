const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Key = require("../models/Key");
const Log = require("../models/LoginLog");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ---------------------------
// Login using KEY
// ---------------------------
router.post("/key-login", async (req, res) => {
    const { key, hwid, ip } = req.body;

    const keyDoc = await Key.findOne({ key, active: true });
    if (!keyDoc) {
        await Log.create({ type: "login", user: key, action: "Invalid key", ip, hwid });
        return res.status(400).json({ message: "Invalid key" });
    }

    if (keyDoc.hwid && keyDoc.hwid !== hwid) {
        await Log.create({ type: "login", user: key, action: "HWID mismatch", ip, hwid });
        return res.status(403).json({ message: "HWID mismatch" });
    }

    if (!keyDoc.hwid) {
        keyDoc.hwid = hwid;
        await keyDoc.save();
    }

    const token = jwt.sign({ key }, process.env.JWT_SECRET, { expiresIn: "7d" });

    await Log.create({ type: "login", user: key, action: "Key login success", ip, hwid });

    res.json({ message: "Logged in", token });
});

// ---------------------------
// Login using USERNAME + PASSWORD
// ---------------------------
router.post("/user-login", async (req, res) => {
    const { username, password, hwid, ip } = req.body;

    const user = await User.findOne({ username });
    if (!user)
        return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(403).json({ message: "Invalid password" });

    if (user.banned)
        return res.status(403).json({ message: "User banned" });

    if (user.hwid && user.hwid !== hwid)
        return res.status(403).json({ message: "HWID mismatch" });

    if (!user.hwid) {
        user.hwid = hwid;
        await user.save();
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });

    await Log.create({ type: "login", user: username, action: "Password login success", ip, hwid });

    res.json({ message: "Logged in", token });
});

module.exports = router;
