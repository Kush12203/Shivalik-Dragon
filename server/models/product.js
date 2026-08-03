const mongoose = require("mongoose");

const productSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true
            },

            slug: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                lowercase: true
            },

            shortDescription: {
                type: String,
                trim: true,
                default: ""
            },

            description: {
                type: String,
                trim: true,
                default: ""
            },

            price: {
                type: Number,
                required: true,
                min: 0
            },

            unit: {
                type: String,
                required: true,
                trim: true,
                default: "kg"
            },

            images: [
                {
                    type: String
                }
            ],

            category: {
                type: String,
                trim: true,
                default: "Fruit"
            },

            stock: {
                type: Number,
                min: 0,
                default: 0
            },

            isAvailable: {
                type: Boolean,
                default: true
            },

            isFeatured: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Product",
        productSchema
    );