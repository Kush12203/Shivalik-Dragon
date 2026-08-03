const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const crypto =
    require("crypto");

const {
    OAuth2Client
} = require(
    "google-auth-library"
);

const User =
    require("../models/user");

const {
    sendPasswordResetEmail
} = require(
    "../services/emailService"
);

const googleClient =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
    );

// =========================
// TOKEN
// =========================

const generateToken = (
    userId
) => {
    return jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

// =========================
// COOKIE OPTIONS
// =========================

const getCookieOptions =
    () => {
        return {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",

            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000
        };
    };

// =========================
// REGISTER
// =========================

exports.register = async (
    req,
    res
) => {
    try {
        const {
            fullName,
            username,
            email,
            phone,
            password
        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Full name, email, phone and password are required."
                });
        }

        if (
            password.length <
            8
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Password must contain at least 8 characters."
                });
        }

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const normalizedUsername =
            username
                ? username
                      .trim()
                      .toLowerCase()
                : undefined;

        const normalizedPhone =
            phone
                .toString()
                .trim();

        const existingEmail =
            await User.findOne({
                email:
                    normalizedEmail
            });

        if (existingEmail) {
            return res
                .status(409)
                .json({
                    success: false,

                    message:
                        "An account with this email already exists."
                });
        }

        if (normalizedUsername) {
            const existingUsername =
                await User.findOne({
                    username:
                        normalizedUsername
                });

            if (
                existingUsername
            ) {
                return res
                    .status(409)
                    .json({
                        success: false,

                        message:
                            "Username already exists."
                    });
            }
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
                    normalizedPhone,

                password:
                    hashedPassword,

                role:
                    "customer",

                authProvider:
                    "local",

                isActive:
                    true
            });

        const token =
            generateToken(
                user._id
            );

        res.cookie(
            "token",
            token,
            getCookieOptions()
        );

        res.status(201).json({
            success: true,

            message:
                "Account created successfully.",

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

                isActive:
                    user.isActive
            }
        });
    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        if (
            error.code ===
            11000
        ) {
            return res
                .status(409)
                .json({
                    success: false,

                    message:
                        "Username or email already exists."
                });
        }

        res.status(500).json({
            success: false,

            message:
                "Unable to create account."
        });
    }
};

// =========================
// LOGIN
// =========================

exports.login = async (
    req,
    res
) => {
    try {
        const {
            identifier,
            password
        } = req.body;

        if (
            !identifier ||
            !password
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Email/username and password are required."
                });
        }

        const normalizedIdentifier =
            identifier
                .trim()
                .toLowerCase();

        const user =
            await User.findOne({
                $or: [
                    {
                        email:
                            normalizedIdentifier
                    },
                    {
                        username:
                            normalizedIdentifier
                    }
                ]
            }).select(
                "+password"
            );

        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,

                    message:
                        "Invalid login credentials."
                });
        }

        if (!user.isActive) {
            return res
                .status(403)
                .json({
                    success: false,

                    message:
                        "This account is inactive."
                });
        }

        if (
            user.authProvider ===
                "google" &&
            !user.password
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Please sign in with Google."
                });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {
            return res
                .status(401)
                .json({
                    success: false,

                    message:
                        "Invalid login credentials."
                });
        }

        const token =
            generateToken(
                user._id
            );

        res.cookie(
            "token",
            token,
            getCookieOptions()
        );

        res.status(200).json({
            success: true,

            message:
                "Login successful.",

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

                isActive:
                    user.isActive
            }
        });
    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to login."
        });
    }
};

// =========================
// GOOGLE LOGIN
// =========================

exports.googleLogin = async (
    req,
    res
) => {
    try {
        const {
            credential
        } = req.body;

        if (!credential) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Google credential is required."
                });
        }

        const ticket =
            await googleClient
                .verifyIdToken({
                    idToken:
                        credential,

                    audience:
                        process.env
                            .GOOGLE_CLIENT_ID
                });

        const payload =
            ticket.getPayload();

        if (!payload) {
            return res
                .status(401)
                .json({
                    success: false,

                    message:
                        "Invalid Google account."
                });
        }

        const {
            sub,
            email,
            name,
            picture,
            email_verified
        } = payload;

        if (
            !email ||
            !email_verified
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "A verified Google email is required."
                });
        }

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        let user =
            await User.findOne({
                email:
                    normalizedEmail
            });

        if (user) {
            if (
                !user.isActive
            ) {
                return res
                    .status(403)
                    .json({
                        success: false,

                        message:
                            "This account is inactive."
                    });
            }

            if (
                !user.googleId
            ) {
                user.googleId =
                    sub;
            }

            if (
                !user.avatar &&
                picture
            ) {
                user.avatar =
                    picture;
            }

            await user.save();
        } else {
            user =
                await User.create({
                    fullName:
                        name ||
                        "Google User",

                    email:
                        normalizedEmail,

                    googleId:
                        sub,

                    avatar:
                        picture ||
                        "",

                    role:
                        "customer",

                    authProvider:
                        "google",

                    isActive:
                        true,

                    phone:
                        ""
                });
        }

        const token =
            generateToken(
                user._id
            );

        res.cookie(
            "token",
            token,
            getCookieOptions()
        );

        res.status(200).json({
            success: true,

            message:
                "Google login successful.",

            needsPhone:
                !user.phone,

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
            "Google login error:",
            error
        );

        res.status(401).json({
            success: false,

            message:
                "Google authentication failed."
        });
    }
};

// =========================
// FORGOT PASSWORD
// =========================

exports.forgotPassword = async (
    req,
    res
) => {
    try {
        const {
            email
        } = req.body;

        if (!email) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Email is required."
                });
        }

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const user =
            await User.findOne({
                email:
                    normalizedEmail
            }).select(
                "+resetPasswordToken +resetPasswordExpires"
            );

        // Always return the same
        // response for security.
        if (!user) {
            return res
                .status(200)
                .json({
                    success: true,

                    message:
                        "If an account exists with this email, a reset link has been sent."
                });
        }

        if (
            user.authProvider ===
                "google" &&
            !user.password
        ) {
            return res
                .status(200)
                .json({
                    success: true,

                    message:
                        "If an account exists with this email, a reset link has been sent."
                });
        }

        const rawToken =
            crypto.randomBytes(
                32
            ).toString(
                "hex"
            );

        const hashedToken =
            crypto
                .createHash(
                    "sha256"
                )
                .update(
                    rawToken
                )
                .digest(
                    "hex"
                );

        user.resetPasswordToken =
            hashedToken;

        user.resetPasswordExpires =
            new Date(
                Date.now() +
                    15 *
                        60 *
                        1000
            );

        await user.save();

        const clientUrl =
            process.env.CLIENT_URL ||
            "http://localhost:5173";

        const resetUrl =
            `${clientUrl}/reset-password/${rawToken}`;

        try {
            await sendPasswordResetEmail({
                to:
                    user.email,

                resetUrl
            });
        } catch (error) {
            user.resetPasswordToken =
                null;

            user.resetPasswordExpires =
                null;

            await user.save();

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        "Unable to send password reset email."
                });
        }

        res.status(200).json({
            success: true,

            message:
                "If an account exists with this email, a reset link has been sent."
        });
    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to process password reset request."
        });
    }
};

// =========================
// RESET PASSWORD
// =========================

exports.resetPassword = async (
    req,
    res
) => {
    try {
        const {
            password
        } = req.body;

        const {
            token
        } = req.params;

        if (
            !password ||
            password.length <
                8
        ) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Password must contain at least 8 characters."
                });
        }

        const hashedToken =
            crypto
                .createHash(
                    "sha256"
                )
                .update(
                    token
                )
                .digest(
                    "hex"
                );

        const user =
            await User.findOne({
                resetPasswordToken:
                    hashedToken,

                resetPasswordExpires: {
                    $gt:
                        new Date()
                }
            }).select(
                "+password +resetPasswordToken +resetPasswordExpires"
            );

        if (!user) {
            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Password reset link is invalid or has expired."
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
            success: true,

            message:
                "Password reset successfully. You can now log in with your new password."
        });
    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to reset password."
        });
    }
};

// =========================
// CURRENT USER
// =========================

exports.getMe = async (
    req,
    res
) => {
    try {
        res.status(200).json({
            success: true,

            user:
                req.user
        });
    } catch (error) {
        console.error(
            "Get me error:",
            error
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to fetch user."
        });
    }
};

// =========================
// LOGOUT
// =========================

exports.logout = async (
    req,
    res
) => {
    try {
        res.cookie(
            "token",
            "",
            {
                httpOnly: true,

                expires:
                    new Date(0),

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax"
            }
        );

        res.status(200).json({
            success: true,

            message:
                "Logged out successfully."
        });
    } catch (error) {
        console.error(
            "Logout error:",
            error
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to logout."
        });
    }
};