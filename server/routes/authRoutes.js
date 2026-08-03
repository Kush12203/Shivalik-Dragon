const express =
    require("express");

const router =
    express.Router();

const authController =
    require(
        "../controllers/authController"
    );

const {
    protect
} = require(
    "../middleware/authMiddleware"
);

// =========================
// REGISTER
// =========================

router.post(
    "/register",
    authController.register
);

// =========================
// LOGIN
// =========================

router.post(
    "/login",
    authController.login
);

// =========================
// GOOGLE LOGIN
// =========================

router.post(
    "/google",
    authController.googleLogin
);

// =========================
// FORGOT PASSWORD
// =========================

router.post(
    "/forgot-password",
    authController.forgotPassword
);

// =========================
// RESET PASSWORD
// =========================

router.post(
    "/reset-password/:token",
    authController.resetPassword
);

// =========================
// CURRENT USER
// =========================

router.get(
    "/me",
    protect,
    authController.getMe
);

// =========================
// LOGOUT
// =========================

router.post(
    "/logout",
    authController.logout
);

module.exports =
    router;