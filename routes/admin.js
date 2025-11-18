const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Key = require("../models/Key");
const User = require("../models/User");
const Log = require("../models/LoginLog");
const { auth, adminOnly } = require("../middleware/auth");

// ---------------------------
// ADMIN LOGIN
// ---------------------------
router.post("/login", async (req, res) => {
    const { password } = req.body;

    if (!password)
        return res.json({ error: "Missing password" });

    if (password !== process.env.ADMIN_PASSWORD)
        return res.json({ error: "Invalid password" });

    const token = jwt.sign(
        { role: "admin" },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
});


// ---------------------------
// Get all users
// ---------------------------
router.get("/users", auth, adminOnly, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// ---------------------------
// Get all keys
// ---------------------------
router.get("/keys", auth, adminOnly, async (req, res) => {
    const keys = await Key.find();
    res.json(keys);
});

// ---------------------------
// Create new key
// ---------------------------
router.post("/create-key", auth, adminOnly, async (req, res) => {
    const { key, expiresAt } = req.body;

    const existing = await Key.findOne({ key });
    if (existing) return res.status(400).json({ message: "Key already exists" });

    const newKey = new Key({
        key,
        expiresAt: expiresAt || null,
        active: true
    });

    await newKey.save();
    res.json({ message: "Key created", key: newKey });
});

// ---------------------------
// Ban a user
// ---------------------------
router.post("/ban-user", auth, adminOnly, async (req, res) => {
    const { username } = req.body;
    await User.updateOne({ username }, { banned: true });

    res.json({ message: "User banned" });
});

// ---------------------------
// Logs
// ---------------------------
router.get("/logs", auth, adminOnly, async (req, res) => {
    const logs = await Log.find().sort({ time: -1 }).limit(50);
    res.json(logs);
});

module.exports = router;

