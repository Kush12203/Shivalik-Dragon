const mongoose = require("mongoose");

const orderItemSchema =
    new mongoose.Schema(
        {
            product: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Product",
                required: true
            },

            productName: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 0.1
            },

            unit: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            subtotal: {
                type: Number,
                required: true,
                min: 0
            }
        },
        {
            _id: false
        }
    );

const orderSchema =
    new mongoose.Schema(
        {
            orderNumber: {
                type: String,
                required: true,
                unique: true
            },

            customer: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "User",
                required: true
            },

            items: [
                orderItemSchema
            ],

            subtotal: {
                type: Number,
                required: true,
                min: 0
            },

            totalAmount: {
                type: Number,
                required: true,
                min: 0
            },

            paymentMethod: {
                type: String,
                enum: [
                    "pay_later",
                    "online"
                ],
                default: "pay_later"
            },

            paymentStatus: {
                type: String,
                enum: [
                    "Unpaid",
                    "Paid",
                    "Failed",
                    "Refunded"
                ],
                default: "Unpaid"
            },

            orderStatus: {
                type: String,
                enum: [
                    "Pending",
                    "Confirmed",
                    "Ready",
                    "Completed",
                    "Cancelled"
                ],
                default: "Pending"
            },

            cancellationReason: {
                type: String,
                trim: true,
                default: ""
            },

            cancelledBy: {
                type: String,
                enum: [
                    "customer",
                    "admin",
                    ""
                ],
                default: ""
            },

            cancelledAt: {
                type: Date,
                default: null
            },

            placedAt: {
                type: Date,
                default: Date.now
            }
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );