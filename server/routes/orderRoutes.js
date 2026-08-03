const express =
    require("express");

const router =
    express.Router();

const orderController =
    require(
        "../controllers/orderController"
    );

const {
    protect,
    adminOnly
} = require(
    "../middleware/authMiddleware"
);

// all order routes require login
router.use(protect);

// CUSTOMER

router.post(
    "/",
    orderController.createOrder
);

router.get(
    "/my",
    orderController.getMyOrders
);

router.patch(
    "/:id/cancel",
    orderController.cancelOrder
);

// ADMIN
// keep these BEFORE /:id

router.get(
    "/admin/all",
    adminOnly,
    orderController.getAllOrders
);

router.patch(
    "/admin/:id/status",
    adminOnly,
    orderController.updateOrderStatus
);

router.patch(
    "/admin/:id/payment",
    adminOnly,
    orderController.updatePaymentStatus
);

// CUSTOMER OR ADMIN

router.get(
    "/:id",
    orderController.getOrder
);

module.exports =
    router;