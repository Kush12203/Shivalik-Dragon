const mongoose =
    require("mongoose");

const User =
    require(
        "../models/user"
    );

const Order =
    require(
        "../models/order"
    );


// =========================
// FORMAT CUSTOMER SUMMARY
// =========================

const buildCustomerSummary =
    async (
        customer
    ) => {

        const orders =
            await Order
                .find({
                    customer:
                        customer._id
                })
                .sort({
                    createdAt:
                        -1
                })
                .lean();


        const totalOrders =
            orders.length;


        const completedOrders =
            orders.filter(
                order =>
                    order.orderStatus ===
                    "Completed"
            ).length;


        const pendingOrders =
            orders.filter(
                order =>
                    [
                        "Pending",
                        "Confirmed",
                        "Ready"
                    ].includes(
                        order.orderStatus
                    )
            ).length;


        const cancelledOrders =
            orders.filter(
                order =>
                    order.orderStatus ===
                    "Cancelled"
            ).length;


        const totalSpent =
            orders
                .filter(
                    order =>
                        order.paymentStatus ===
                            "Paid" ||
                        order.orderStatus ===
                            "Completed"
                )
                .reduce(
                    (
                        total,
                        order
                    ) =>
                        total +
                        Number(
                            order.totalAmount ||
                            0
                        ),
                    0
                );


        const unpaidAmount =
            orders
                .filter(
                    order =>
                        order.paymentStatus ===
                            "Unpaid" &&
                        order.orderStatus !==
                            "Cancelled"
                )
                .reduce(
                    (
                        total,
                        order
                    ) =>
                        total +
                        Number(
                            order.totalAmount ||
                            0
                        ),
                    0
                );


        return {
            _id:
                customer._id,

            fullName:
                customer.fullName,

            username:
                customer.username,

            email:
                customer.email,

            phone:
                customer.phone,

            avatar:
                customer.avatar,

            authProvider:
                customer.authProvider,

            role:
                customer.role,

            isActive:
                customer.isActive,

            createdAt:
                customer.createdAt,

            updatedAt:
                customer.updatedAt,

            totalOrders,

            completedOrders,

            pendingOrders,

            cancelledOrders,

            totalSpent,

            unpaidAmount,

            lastOrderAt:
                orders[0]
                    ?.placedAt ||
                orders[0]
                    ?.createdAt ||
                null
        };
    };


// =========================
// GET ALL CUSTOMERS
// ADMIN
// =========================

exports.getCustomers =
    async (
        req,
        res
    ) => {

        try {

            const {
                search = "",
                status = "all"
            } = req.query;


            const filter = {
                role:
                    "customer"
            };


            if (
                status ===
                "active"
            ) {
                filter.isActive =
                    true;
            }


            if (
                status ===
                "inactive"
            ) {
                filter.isActive =
                    false;
            }


            if (
                search.trim()
            ) {

                const escapedSearch =
                    search
                        .trim()
                        .replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );


                const regex =
                    new RegExp(
                        escapedSearch,
                        "i"
                    );


                filter.$or = [
                    {
                        fullName:
                            regex
                    },

                    {
                        username:
                            regex
                    },

                    {
                        email:
                            regex
                    },

                    {
                        phone:
                            regex
                    }
                ];
            }


            const customers =
                await User
                    .find(
                        filter
                    )
                    .select(
                        "-password -resetPasswordToken -resetPasswordExpires"
                    )
                    .sort({
                        createdAt:
                            -1
                    });


            const result =
                await Promise.all(
                    customers.map(
                        customer =>
                            buildCustomerSummary(
                                customer
                            )
                    )
                );


            return res
                .status(200)
                .json({
                    success:
                        true,

                    count:
                        result.length,

                    customers:
                        result
                });

        } catch (error) {

            console.error(
                "Get customers error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to fetch customers."
                });
        }
    };


// =========================
// GET CUSTOMER PROFILE
// ADMIN
// =========================

exports.getCustomer =
    async (
        req,
        res
    ) => {

        try {

            const {
                id
            } = req.params;


            if (
                !mongoose.Types
                    .ObjectId
                    .isValid(
                        id
                    )
            ) {

                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Invalid customer ID."
                    });
            }


            const customer =
                await User
                    .findOne({
                        _id:
                            id,

                        role:
                            "customer"
                    })
                    .select(
                        "-password -resetPasswordToken -resetPasswordExpires"
                    );


            if (!customer) {

                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Customer not found."
                    });
            }


            const orders =
                await Order
                    .find({
                        customer:
                            customer._id
                    })
                    .populate(
                        "items.product",
                        "name slug images"
                    )
                    .sort({
                        createdAt:
                            -1
                    });


            const totalOrders =
                orders.length;


            const completedOrders =
                orders.filter(
                    order =>
                        order.orderStatus ===
                        "Completed"
                ).length;


            const pendingOrders =
                orders.filter(
                    order =>
                        [
                            "Pending",
                            "Confirmed",
                            "Ready"
                        ].includes(
                            order.orderStatus
                        )
                ).length;


            const cancelledOrders =
                orders.filter(
                    order =>
                        order.orderStatus ===
                        "Cancelled"
                ).length;


            const paidOrders =
                orders.filter(
                    order =>
                        order.paymentStatus ===
                        "Paid"
                ).length;


            const unpaidOrders =
                orders.filter(
                    order =>
                        order.paymentStatus ===
                        "Unpaid" &&
                    order.orderStatus !==
                        "Cancelled"
                ).length;


            const totalSpent =
                orders
                    .filter(
                        order =>
                            order.paymentStatus ===
                                "Paid" ||
                            order.orderStatus ===
                                "Completed"
                    )
                    .reduce(
                        (
                            total,
                            order
                        ) =>
                            total +
                            Number(
                                order.totalAmount ||
                                0
                            ),
                        0
                    );


            const unpaidAmount =
                orders
                    .filter(
                        order =>
                            order.paymentStatus ===
                                "Unpaid" &&
                            order.orderStatus !==
                                "Cancelled"
                    )
                    .reduce(
                        (
                            total,
                            order
                        ) =>
                            total +
                            Number(
                                order.totalAmount ||
                                0
                            ),
                        0
                    );


            return res
                .status(200)
                .json({
                    success:
                        true,

                    customer: {
                        _id:
                            customer._id,

                        fullName:
                            customer.fullName,

                        username:
                            customer.username,

                        email:
                            customer.email,

                        phone:
                            customer.phone,

                        avatar:
                            customer.avatar,

                        authProvider:
                            customer.authProvider,

                        isActive:
                            customer.isActive,

                        createdAt:
                            customer.createdAt,

                        updatedAt:
                            customer.updatedAt,

                        stats: {
                            totalOrders,

                            completedOrders,

                            pendingOrders,

                            cancelledOrders,

                            paidOrders,

                            unpaidOrders,

                            totalSpent,

                            unpaidAmount
                        },

                        orders
                    }
                });

        } catch (error) {

            console.error(
                "Get customer profile error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to fetch customer profile."
                });
        }
    };