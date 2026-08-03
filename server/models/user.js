const mongoose = require("mongoose");

const userSchema =
    new mongoose.Schema(
        {
            fullName: {
                type: String,
                trim: true,
                default: ""
            },

            username: {
                type: String,
                trim: true,
                lowercase: true,
                unique: true,
                sparse: true
            },

            email: {
                type: String,
                trim: true,
                lowercase: true,
                unique: true,
                sparse: true
            },

            phone: {
                type: String,
                trim: true,
                default: ""
            },

            password: {
                type: String,
                select: false
            },

            role: {
                type: String,
                enum: [
                    "customer",
                    "admin",
                    "superadmin"
                ],
                default: "customer"
            },

            authProvider: {
                type: String,
                enum: [
                    "local",
                    "google"
                ],
                default: "local"
            },

            googleId: {
                type: String,
                default: null
            },

            avatar: {
                type: String,
                default: ""
            },

            isActive: {
                type: Boolean,
                default: true
            },

            resetPasswordToken: {
                type: String,
                default: null,
                select: false
            },

            resetPasswordExpires: {
                type: Date,
                default: null,
                select: false
            }
        },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "User",
        userSchema
    );