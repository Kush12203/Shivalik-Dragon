const Order =
    require(
        "../models/order"
    );

const Cart =
    require(
        "../models/cart"
    );

const Product =
    require(
        "../models/product"
    );

const {
    notifyOrderPlaced,
    notifyOrderStatus,
    notifyPaymentStatus
} = require(
    "../services/notificationService"
);


// =========================
// ORDER NUMBER
// =========================

const generateOrderNumber =
    async () => {
        const year =
            new Date()
                .getFullYear();

        const start =
            new Date(
                `${year}-01-01T00:00:00.000Z`
            );

        const end =
            new Date(
                `${year + 1}-01-01T00:00:00.000Z`
            );

        const count =
            await Order
                .countDocuments({
                    createdAt: {
                        $gte:
                            start,

                        $lt:
                            end
                    }
                });

        const sequence =
            String(
                count + 1
            ).padStart(
                5,
                "0"
            );

        return `SD-${year}-${sequence}`;
    };


// =========================
// RESTORE STOCK HELPER
// =========================

const restoreStock =
    async (
        items
    ) => {
        for (
            const item
            of items
        ) {
            await Product.updateOne(
                {
                    _id:
                        item.product
                },
                {
                    $inc: {
                        stock:
                            Number(
                                item.quantity ||
                                    0
                            )
                    }
                }
            );
        }
    };


// =========================
// CREATE ORDER
// =========================

exports.createOrder = async (
    req,
    res
) => {
    const deductedItems =
        [];

    try {
        const cart =
            await Cart
                .findOne({
                    user:
                        req.user._id
                })
                .populate(
                    "items.product"
                );

        if (
            !cart ||
            cart.items.length ===
                0
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Your cart is empty."
                });
        }

        const items = [];

        let subtotal = 0;

        // =========================
        // VALIDATE CART
        // =========================

        for (
            const cartItem
            of cart.items
        ) {
            const product =
                cartItem.product;

            if (!product) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "One of the cart products no longer exists."
                    });
            }

            if (
                !product.isAvailable
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            `${product.name} is currently unavailable.`
                    });
            }

            const price =
                Number(
                    product.price
                );

            const quantity =
                Number(
                    cartItem.quantity
                );

            if (
                !Number.isFinite(
                    price
                ) ||
                price < 0
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            `Invalid price for ${product.name}.`
                    });
            }

            if (
                !Number.isFinite(
                    quantity
                ) ||
                quantity <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            `Invalid quantity for ${product.name}.`
                    });
            }

            const itemSubtotal =
                price *
                quantity;

            subtotal +=
                itemSubtotal;

            items.push({
                product:
                    product._id,

                productName:
                    product.name,

                quantity,

                unit:
                    product.unit,

                price,

                subtotal:
                    itemSubtotal,

                trackedStock:
                    product.stock >
                    0
            });
        }

        // =========================
        // ATOMIC STOCK DEDUCTION
        // =========================

        for (
            const item
            of items
        ) {
            if (
                !item.trackedStock
            ) {
                continue;
            }

            const updatedProduct =
                await Product
                    .findOneAndUpdate(
                        {
                            _id:
                                item.product,

                            isAvailable:
                                true,

                            stock: {
                                $gte:
                                    item.quantity
                            }
                        },
                        {
                            $inc: {
                                stock:
                                    -item.quantity
                            }
                        },
                        {
                            new:
                                true
                        }
                    );

            if (
                !updatedProduct
            ) {
                // Roll back anything
                // already deducted.
                await restoreStock(
                    deductedItems
                );

                return res
                    .status(409)
                    .json({
                        success:
                            false,

                        message:
                            `${item.productName} no longer has enough stock. Please refresh your cart.`
                    });
            }

            deductedItems.push(
                item
            );
        }

        // Remove helper property
        // before saving order.
        const orderItems =
            items.map(
                ({
                    trackedStock,
                    ...item
                }) => item
            );

        const orderNumber =
            await generateOrderNumber();

        let order;

        try {
            order =
                await Order.create({
                    orderNumber,

                    customer:
                        req.user._id,

                    items:
                        orderItems,

                    subtotal,

                    totalAmount:
                        subtotal,

                    paymentMethod:
                        "pay_later",

                    paymentStatus:
                        "Unpaid",

                    orderStatus:
                        "Pending"
                });
        } catch (error) {
            await restoreStock(
                deductedItems
            );

            throw error;
        }

        // =========================
        // CLEAR CART
        // =========================

        cart.items = [];

        await cart.save();

        const populatedOrder =
            await Order
                .findById(
                    order._id
                )
                .populate(
                    "customer",
                    "fullName username email phone avatar"
                )
                .populate(
                    "items.product",
                    "name slug images"
                );

        // =========================
        // EMAIL
        // =========================

        notifyOrderPlaced(
            populatedOrder.customer,
            populatedOrder
        ).catch(
            error => {
                console.error(
                    "Order email notification failed:",
                    error.message
                );
            }
        );

        res.status(201).json({
            success:
                true,

            message:
                "Order placed successfully.",

            order:
                populatedOrder
        });
    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to place order."
        });
    }
};


// =========================
// MY ORDERS
// =========================

exports.getMyOrders = async (
    req,
    res
) => {
    try {
        const orders =
            await Order
                .find({
                    customer:
                        req.user._id
                })
                .populate(
                    "items.product",
                    "name slug images"
                )
                .sort({
                    createdAt:
                        -1
                });

        res.status(200).json({
            success:
                true,

            count:
                orders.length,

            orders
        });
    } catch (error) {
        console.error(
            "Get my orders error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch your orders."
        });
    }
};


// =========================
// SINGLE ORDER
// =========================

exports.getOrder = async (
    req,
    res
) => {
    try {
        const order =
            await Order
                .findById(
                    req.params.id
                )
                .populate(
                    "customer",
                    "fullName username email phone avatar role"
                )
                .populate(
                    "items.product",
                    "name slug images"
                );

        if (!order) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Order not found."
                });
        }

        const isOwner =
            order.customer
                ._id
                .toString() ===
            req.user._id
                .toString();

        const isAdmin =
            [
                "admin",
                "superadmin"
            ].includes(
                req.user.role
            );

        if (
            !isOwner &&
            !isAdmin
        ) {
            return res
                .status(403)
                .json({
                    success:
                        false,

                    message:
                        "You are not allowed to view this order."
                });
        }

        res.status(200).json({
            success:
                true,

            order
        });
    } catch (error) {
        console.error(
            "Get order error:",
            error
        );

        if (
            error.name ===
            "CastError"
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Invalid order ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch order."
        });
    }
};


// =========================
// CUSTOMER CANCEL
// =========================

exports.cancelOrder = async (
    req,
    res
) => {
    try {
        const {
            reason = ""
        } = req.body;

        const order =
            await Order.findOne({
                _id:
                    req.params.id,

                customer:
                    req.user._id
            });

        if (!order) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Order not found."
                });
        }

        if (
            ![
                "Pending",
                "Confirmed"
            ].includes(
                order.orderStatus
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "This order can no longer be cancelled."
                });
        }

        order.orderStatus =
            "Cancelled";

        order.cancellationReason =
            String(
                reason
            )
                .trim()
                .slice(
                    0,
                    500
                );

        order.cancelledBy =
            "customer";

        order.cancelledAt =
            new Date();

        await order.save();

        await restoreStock(
            order.items
        );

        const populatedOrder =
            await Order
                .findById(
                    order._id
                )
                .populate(
                    "customer",
                    "fullName username email phone"
                )
                .populate(
                    "items.product",
                    "name slug images"
                );

        notifyOrderStatus(
            populatedOrder.customer,
            populatedOrder
        ).catch(
            error => {
                console.error(
                    "Cancellation email failed:",
                    error.message
                );
            }
        );

        res.status(200).json({
            success:
                true,

            message:
                "Order cancelled successfully.",

            order:
                populatedOrder
        });
    } catch (error) {
        console.error(
            "Cancel order error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to cancel order."
        });
    }
};


// =========================
// ADMIN GET ALL
// =========================

exports.getAllOrders = async (
    req,
    res
) => {
    try {
        const orders =
            await Order
                .find()
                .populate(
                    "customer",
                    "fullName username email phone avatar"
                )
                .populate(
                    "items.product",
                    "name slug images"
                )
                .sort({
                    createdAt:
                        -1
                });

        res.status(200).json({
            success:
                true,

            count:
                orders.length,

            orders
        });
    } catch (error) {
        console.error(
            "Get all orders error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch orders."
        });
    }
};


// =========================
// ADMIN STATUS UPDATE
// =========================

exports.updateOrderStatus = async (
    req,
    res
) => {
    try {
        const {
            orderStatus
        } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Ready",
            "Completed",
            "Cancelled"
        ];

        if (
            !allowedStatuses.includes(
                orderStatus
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Invalid order status."
                });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Order not found."
                });
        }

        if (
            order.orderStatus ===
                "Cancelled" &&
            orderStatus !==
                "Cancelled"
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Cancelled orders cannot be reopened."
                });
        }

        if (
            orderStatus ===
                "Cancelled" &&
            order.orderStatus !==
                "Cancelled"
        ) {
            order.cancelledBy =
                "admin";

            order.cancelledAt =
                new Date();

            await restoreStock(
                order.items
            );
        }

        order.orderStatus =
            orderStatus;

        await order.save();

        const populatedOrder =
            await Order
                .findById(
                    order._id
                )
                .populate(
                    "customer",
                    "fullName username email phone"
                )
                .populate(
                    "items.product",
                    "name slug images"
                );

        notifyOrderStatus(
            populatedOrder.customer,
            populatedOrder
        ).catch(
            error => {
                console.error(
                    "Status email failed:",
                    error.message
                );
            }
        );

        res.status(200).json({
            success:
                true,

            message:
                "Order status updated successfully.",

            order:
                populatedOrder
        });
    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to update order status."
        });
    }
};


// =========================
// ADMIN PAYMENT STATUS
// =========================

exports.updatePaymentStatus = async (
    req,
    res
) => {
    try {
        const {
            paymentStatus
        } = req.body;

        const allowedStatuses = [
            "Unpaid",
            "Paid",
            "Failed",
            "Refunded"
        ];

        if (
            !allowedStatuses.includes(
                paymentStatus
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Invalid payment status."
                });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Order not found."
                });
        }

        order.paymentStatus =
            paymentStatus;

        await order.save();

        const populatedOrder =
            await Order
                .findById(
                    order._id
                )
                .populate(
                    "customer",
                    "fullName username email phone"
                )
                .populate(
                    "items.product",
                    "name slug images"
                );

        notifyPaymentStatus(
            populatedOrder.customer,
            populatedOrder
        ).catch(
            error => {
                console.error(
                    "Payment email failed:",
                    error.message
                );
            }
        );

        res.status(200).json({
            success:
                true,

            message:
                "Payment status updated successfully.",

            order:
                populatedOrder
        });
    } catch (error) {
        console.error(
            "Update payment status error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to update payment status."
        });
    }
};