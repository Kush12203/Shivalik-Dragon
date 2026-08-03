const bcrypt =
    require(
        "bcryptjs"
    );

const User =
    require(
        "../models/user"
    );


// =========================
// GET ALL USERS
// ADMIN / SUPERADMIN
// =========================

exports.getUsers = async (
    req,
    res
) => {
    try {
        const {
            role,
            search
        } = req.query;

        const filter = {};

        if (
            role &&
            [
                "customer",
                "admin",
                "superadmin"
            ].includes(
                role
            )
        ) {
            filter.role =
                role;
        }

        if (
            search &&
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

        const users =
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

        res.status(200).json({
            success:
                true,

            count:
                users.length,

            users
        });
    } catch (error) {
        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch users."
        });
    }
};


// =========================
// GET CUSTOMERS
// ADMIN / SUPERADMIN
// =========================

exports.getCustomers = async (
    req,
    res
) => {
    try {
        const customers =
            await User
                .find({
                    role:
                        "customer"
                })
                .select(
                    "-password -resetPasswordToken -resetPasswordExpires"
                )
                .sort({
                    createdAt:
                        -1
                });

        res.status(200).json({
            success:
                true,

            count:
                customers.length,

            customers
        });
    } catch (error) {
        console.error(
            "Get customers error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch customers."
        });
    }
};


// =========================
// GET SINGLE USER
// ADMIN / SUPERADMIN
// =========================

exports.getUser = async (
    req,
    res
) => {
    try {
        const user =
            await User
                .findById(
                    req.params.id
                )
                .select(
                    "-password -resetPasswordToken -resetPasswordExpires"
                );

        if (!user) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "User not found."
                });
        }

        res.status(200).json({
            success:
                true,

            user
        });
    } catch (error) {
        console.error(
            "Get user error:",
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
                        "Invalid user ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch user."
        });
    }
};


// =========================
// CREATE ADMIN
// SUPERADMIN ONLY
// =========================

exports.createAdmin = async (
    req,
    res
) => {
    try {
        const {
            fullName,
            username,
            email,
            phone,
            password,
            role = "admin"
        } = req.body;

        if (
            !fullName ||
            !username ||
            !email ||
            !password
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Full name, username, email and password are required."
                });
        }

        if (
            ![
                "admin",
                "superadmin"
            ].includes(
                role
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Invalid admin role."
                });
        }

        if (
            password.length <
            8
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Password must contain at least 8 characters."
                });
        }

        const normalizedUsername =
            username
                .trim()
                .toLowerCase();

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const existing =
            await User.findOne({
                $or: [
                    {
                        username:
                            normalizedUsername
                    },
                    {
                        email:
                            normalizedEmail
                    }
                ]
            });

        if (existing) {
            return res
                .status(409)
                .json({
                    success:
                        false,

                    message:
                        "Username or email already exists."
                });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        const user =
            await User.create({
                fullName:
                    fullName.trim(),

                username:
                    normalizedUsername,

                email:
                    normalizedEmail,

                phone:
                    phone?.trim() ||
                    "",

                password:
                    hashedPassword,

                role,

                authProvider:
                    "local",

                isActive:
                    true
            });

        res.status(201).json({
            success:
                true,

            message:
                "Administrator created successfully.",

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

                isActive:
                    user.isActive,

                createdAt:
                    user.createdAt
            }
        });
    } catch (error) {
        console.error(
            "Create admin error:",
            error
        );

        if (
            error.code ===
            11000
        ) {
            return res
                .status(409)
                .json({
                    success:
                        false,

                    message:
                        "Username or email already exists."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to create administrator."
        });
    }
};


// =========================
// UPDATE USER
// SUPERADMIN ONLY
// =========================

exports.updateUser = async (
    req,
    res
) => {
    try {
        const {
            role,
            isActive,
            fullName,
            phone
        } = req.body;

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "User not found."
                });
        }

        const isSelf =
            user._id
                .toString() ===
            req.user._id
                .toString();

        // =========================
        // IS ACTIVE VALIDATION
        // =========================

        if (
            isActive !==
            undefined &&
            typeof isActive !==
                "boolean"
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "isActive must be true or false."
                });
        }

        // =========================
        // SELF PROTECTION
        // =========================

        if (
            isSelf &&
            isActive ===
                false
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "You cannot deactivate your own account."
                });
        }

        if (
            isSelf &&
            role &&
            role !==
                "superadmin"
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "You cannot remove your own superadmin role."
                });
        }

        // =========================
        // ROLE VALIDATION
        // =========================

        if (
            role !==
                undefined &&
            ![
                "customer",
                "admin",
                "superadmin"
            ].includes(
                role
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Invalid user role."
                });
        }

        if (
            fullName !==
            undefined
        ) {
            const trimmedName =
                String(
                    fullName
                ).trim();

            if (!trimmedName) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Full name cannot be empty."
                    });
            }

            user.fullName =
                trimmedName;
        }

        if (
            phone !==
            undefined
        ) {
            user.phone =
                String(
                    phone
                ).trim();
        }

        if (
            role !==
            undefined
        ) {
            user.role =
                role;
        }

        if (
            isActive !==
            undefined
        ) {
            user.isActive =
                isActive;
        }

        await user.save();

        res.status(200).json({
            success:
                true,

            message:
                "User updated successfully.",

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

                isActive:
                    user.isActive,

                updatedAt:
                    user.updatedAt
            }
        });
    } catch (error) {
        console.error(
            "Update user error:",
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
                        "Invalid user ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to update user."
        });
    }
};


// =========================
// RESET PASSWORD
// SUPERADMIN ONLY
// =========================

exports.resetPassword = async (
    req,
    res
) => {
    try {
        const {
            password
        } = req.body;

        if (
            !password ||
            password.length <
                8
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Password must contain at least 8 characters."
                });
        }

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "User not found."
                });
        }

        user.password =
            await bcrypt.hash(
                password,
                12
            );

        user.authProvider =
            "local";

        user.resetPasswordToken =
            null;

        user.resetPasswordExpires =
            null;

        await user.save();

        res.status(200).json({
            success:
                true,

            message:
                "Password reset successfully."
        });
    } catch (error) {
        console.error(
            "Reset password error:",
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
                        "Invalid user ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to reset password."
        });
    }
};


// =========================
// DELETE USER
// SUPERADMIN ONLY
// =========================

exports.deleteUser = async (
    req,
    res
) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "User not found."
                });
        }

        if (
            user._id
                .toString() ===
            req.user._id
                .toString()
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "You cannot delete your own account."
                });
        }

        await user.deleteOne();

        res.status(200).json({
            success:
                true,

            message:
                "User deleted successfully."
        });
    } catch (error) {
        console.error(
            "Delete user error:",
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
                        "Invalid user ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to delete user."
        });
    }
};