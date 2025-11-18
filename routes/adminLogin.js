const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.json({ error: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.json({ error: "Wrong password" });

    const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.ADMIN_JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        success: true,
        token,
        role: admin.role
    });
});

module.exports = router;
