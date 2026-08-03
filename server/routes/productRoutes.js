const express =
    require("express");

const router =
    express.Router();

const productController =
    require(
        "../controllers/productController"
    );

const {
    protect,
    adminOnly
} = require(
    "../middleware/authMiddleware"
);

// PUBLIC

router.get(
    "/",
    productController.getProducts
);

router.get(
    "/:slug",
    productController.getProduct
);

// ADMIN

router.post(
    "/",
    protect,
    adminOnly,
    productController.createProduct
);

router.put(
    "/:id",
    protect,
    adminOnly,
    productController.updateProduct
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    productController.deleteProduct
);

module.exports =
    router;