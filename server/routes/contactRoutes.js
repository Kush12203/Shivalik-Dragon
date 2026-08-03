const express =
    require("express");

const router =
    express.Router();

const contactController =
    require(
        "../controllers/contactController"
    );

const {
    protect,
    adminOnly
} = require(
    "../middleware/authMiddleware"
);


// =========================
// PUBLIC CONTACT FORM
// =========================

router.post(
    "/",
    contactController.sendContactMessage
);


// =========================
// ADMIN ENQUIRIES
// =========================

router.get(
    "/admin",
    protect,
    adminOnly,
    contactController.getContactMessages
);

router.get(
    "/admin/:id",
    protect,
    adminOnly,
    contactController.getContactMessage
);

router.patch(
    "/admin/:id/read",
    protect,
    adminOnly,
    contactController.updateReadStatus
);

router.patch(
    "/admin/:id/resolve",
    protect,
    adminOnly,
    contactController.updateResolvedStatus
);

router.delete(
    "/admin/:id",
    protect,
    adminOnly,
    contactController.deleteContactMessage
);


module.exports =
    router;