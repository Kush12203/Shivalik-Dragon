const jwt = require("jsonwebtoken");

const User = require("../models/user");

// =========================
// PROTECT
// =========================

exports.protect = async (
    req,
    res,
    next
) => {
    try {
        let token =
            req.cookies?.token;

        if (
            !token &&
            req.headers.authorization
                ?.startsWith(
                    "Bearer "
                )
        ) {
            token =
                req.headers.authorization
                    .split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required."
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const user =
            await User.findById(
                decoded.userId
            ).select(
                "-password"
            );

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "User account not found."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message:
                    "This account is inactive."
            });
        }

        req.user =
            user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired session."
        });
    }
};

// =========================
// ADMIN
// =========================

exports.adminOnly = (
    req,
    res,
    next
) => {
    if (
        ![
            "admin",
            "superadmin"
        ].includes(
            req.user.role
        )
    ) {
        return res.status(403).json({
            success: false,
            message:
                "Administrator access required."
        });
    }

    next();
};

// =========================
// SUPERADMIN
// =========================

exports.superAdminOnly = (
    req,
    res,
    next
) => {
    if (
        req.user.role !==
        "superadmin"
    ) {
        return res.status(403).json({
            success: false,
            message:
                "Superadmin access required."
        });
    }

    next();
};