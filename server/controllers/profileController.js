const bcrypt = require("bcryptjs");
const User = require("../models/user");

// =========================
// GET PROFILE
// =========================

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user._id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(
            "Get profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch profile."
        });
    }
};

// =========================
// UPDATE PROFILE
// =========================

exports.updateProfile = async (
    req,
    res
) => {
    try {
        const {
            fullName,
            username,
            phone
        } = req.body;

        const user =
            await User.findById(
                req.user._id
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // =========================
        // FULL NAME
        // =========================

        if (fullName !== undefined) {
            const value =
                fullName.trim();

            if (!value) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Full name cannot be empty."
                });
            }

            user.fullName = value;
        }

        // =========================
        // USERNAME
        // =========================

        if (username !== undefined) {
            const normalizedUsername =
                username
                    .trim()
                    .toLowerCase();

            if (!normalizedUsername) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Username cannot be empty."
                });
            }

            const existingUsername =
                await User.findOne({
                    username:
                        normalizedUsername,

                    _id: {
                        $ne:
                            user._id
                    }
                });

            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Username already exists."
                });
            }

            user.username =
                normalizedUsername;
        }

        // =========================
        // PHONE
        // =========================

        if (phone !== undefined) {
            const normalizedPhone =
                phone
                    .toString()
                    .trim();

            if (!normalizedPhone) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Phone number cannot be empty."
                });
            }

            user.phone =
                normalizedPhone;
        }

        await user.save();

        res.status(200).json({
            success: true,

            message:
                "Profile updated successfully.",

            user: {
                _id:
                    user._id,

                fullName:
                    user.fullName,

                username:
                    user.username,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                avatar:
                    user.avatar,

                authProvider:
                    user.authProvider,

                isActive:
                    user.isActive
            }
        });
    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update profile."
        });
    }
};

// =========================
// CHANGE PASSWORD
// =========================

exports.changePassword = async (
    req,
    res
) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must contain at least 8 characters."
            });
        }

        const user =
            await User.findById(
                req.user._id
            ).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found."
            });
        }

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message:
                    "Password change is not available for this account."
            });
        }

        const validPassword =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect."
            });
        }

        const samePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from your current password."
            });
        }

        user.password =
            await bcrypt.hash(
                newPassword,
                12
            );

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Password changed successfully."
        });
    } catch (error) {
        console.error(
            "Change password error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to change password."
        });
    }
};