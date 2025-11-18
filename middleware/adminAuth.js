const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports.requireAdmin = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token)
        return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        const admin = await Admin.findById(decoded.id);
        if (!admin)
            return res.status(401).json({ error: "Admin not found" });

        req.admin = admin;
        next();

    } catch (err) {
        return res.status(401).json({ error: "Invalid / expired token" });
    }
};

// ROLE CHECKER
module.exports.requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
};
