const Cart = require("../models/cart");
const Product = require("../models/product");

// =========================
// GET CART
// =========================

exports.getCart = async (
    req,
    res
) => {
    try {
        let cart =
            await Cart.findOne({
                user:
                    req.user._id
            }).populate(
                "items.product"
            );

        if (!cart) {
            cart =
                await Cart.create({
                    user:
                        req.user._id,
                    items: []
                });

            cart =
                await Cart.findById(
                    cart._id
                ).populate(
                    "items.product"
                );
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error(
            "Get cart error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch cart."
        });
    }
};

// =========================
// ADD TO CART
// =========================

exports.addToCart = async (
    req,
    res
) => {
    try {
        const {
            productId,
            quantity
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message:
                    "Product is required."
            });
        }

        const numericQuantity =
            Number(quantity);

        if (
            !numericQuantity ||
            numericQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than zero."
            });
        }

        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        if (
            !product.isAvailable
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This product is currently unavailable."
            });
        }

        if (
            product.stock > 0 &&
            numericQuantity >
                product.stock
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Requested quantity exceeds available stock."
            });
        }

        let cart =
            await Cart.findOne({
                user:
                    req.user._id
            });

        if (!cart) {
            cart =
                await Cart.create({
                    user:
                        req.user._id,
                    items: []
                });
        }

        const existingItem =
            cart.items.find(
                (item) =>
                    item.product.toString() ===
                    productId
            );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity +
                numericQuantity;

            if (
                product.stock > 0 &&
                newQuantity >
                    product.stock
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Cart quantity exceeds available stock."
                });
            }

            existingItem.quantity =
                newQuantity;
        } else {
            cart.items.push({
                product:
                    productId,
                quantity:
                    numericQuantity
            });
        }

        await cart.save();

        cart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );

        res.status(200).json({
            success: true,
            message:
                "Product added to cart.",
            cart
        });
    } catch (error) {
        console.error(
            "Add to cart error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to add product to cart."
        });
    }
};

// =========================
// UPDATE CART ITEM
// =========================

exports.updateCartItem = async (
    req,
    res
) => {
    try {
        const {
            quantity
        } = req.body;

        const numericQuantity =
            Number(quantity);

        if (
            !numericQuantity ||
            numericQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than zero."
            });
        }

        let cart =
            await Cart.findOne({
                user:
                    req.user._id
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart not found."
            });
        }

        const item =
            cart.items.id(
                req.params.itemId
            );

        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found."
            });
        }

        const product =
            await Product.findById(
                item.product
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        if (
            product.stock > 0 &&
            numericQuantity >
                product.stock
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Requested quantity exceeds available stock."
            });
        }

        item.quantity =
            numericQuantity;

        await cart.save();

        cart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );

        res.status(200).json({
            success: true,
            message:
                "Cart updated successfully.",
            cart
        });
    } catch (error) {
        console.error(
            "Update cart error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update cart."
        });
    }
};

// =========================
// REMOVE CART ITEM
// =========================

exports.removeCartItem = async (
    req,
    res
) => {
    try {
        let cart =
            await Cart.findOne({
                user:
                    req.user._id
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart not found."
            });
        }

        const item =
            cart.items.id(
                req.params.itemId
            );

        if (!item) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found."
            });
        }

        item.deleteOne();

        await cart.save();

        cart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );

        res.status(200).json({
            success: true,
            message:
                "Product removed from cart.",
            cart
        });
    } catch (error) {
        console.error(
            "Remove cart error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to remove product from cart."
        });
    }
};

// =========================
// CLEAR CART
// =========================

exports.clearCart = async (
    req,
    res
) => {
    try {
        let cart =
            await Cart.findOne({
                user:
                    req.user._id
            });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message:
                    "Cart is already empty."
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message:
                "Cart cleared successfully.",
            cart
        });
    } catch (error) {
        console.error(
            "Clear cart error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to clear cart."
        });
    }
};