const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = {
    auth: (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
    },

    adminOnly: async (req, res, next) => {
        try {
            const admin = await Admin.findOne({ username: req.user.username });
            if (!admin) return res.status(403).json({ message: "Admin only" });
            next();
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    }
};
