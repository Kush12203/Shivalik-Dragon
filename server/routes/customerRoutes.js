const express =
    require("express");

const router =
    express.Router();

const {
    protect,
    adminOnly
} = require(
    "../middleware/authMiddleware"
);

const customerController =
    require(
        "../controllers/customerController"
    );


// =========================
// ALL ROUTES ADMIN ONLY
// =========================

router.use(
    protect
);

router.use(
    adminOnly
);


// =========================
// CUSTOMERS
// =========================

router.get(
    "/",
    customerController.getCustomers
);


router.get(
    "/:id",
    customerController.getCustomer
);


module.exports =
    router;