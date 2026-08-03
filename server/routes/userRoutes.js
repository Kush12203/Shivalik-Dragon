const express =
    require("express");

const router =
    express.Router();

const userController =
    require(
        "../controllers/userController"
    );

const {
    protect,
    adminOnly,
    superAdminOnly
} = require(
    "../middleware/authMiddleware"
);

// all routes require login
router.use(protect);

// =========================
// ADMIN / SUPERADMIN
// =========================

router.get(
    "/",
    adminOnly,
    userController.getUsers
);

router.get(
    "/customers",
    adminOnly,
    userController.getCustomers
);

router.get(
    "/:id",
    adminOnly,
    userController.getUser
);

// =========================
// SUPERADMIN ONLY
// =========================

router.post(
    "/admins",
    superAdminOnly,
    userController.createAdmin
);

router.put(
    "/:id",
    superAdminOnly,
    userController.updateUser
);

router.put(
    "/:id/password",
    superAdminOnly,
    userController.resetPassword
);

router.delete(
    "/:id",
    superAdminOnly,
    userController.deleteUser
);

module.exports =
    router;