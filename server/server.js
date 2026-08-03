require("dotenv").config();

const express =
    require("express");

const cors =
    require("cors");

const cookieParser =
    require("cookie-parser");

const helmet =
    require("helmet");

const rateLimit =
    require("express-rate-limit");

const connectDB =
    require("./config/db");

const authRoutes =
    require(
        "./routes/authRoutes"
    );

const productRoutes =
    require(
        "./routes/productRoutes"
    );

const cartRoutes =
    require(
        "./routes/cartRoutes"
    );

const orderRoutes =
    require(
        "./routes/orderRoutes"
    );

const userRoutes =
    require(
        "./routes/userRoutes"
    );

const profileRoutes =
    require(
        "./routes/profileRoutes"
    );

const contactRoutes =
    require(
        "./routes/contactRoutes"
    );
const galleryRoutes =
    require(
        "./routes/galleryRoutes"
    );
const app =
    express();


// =========================
// DATABASE
// =========================

connectDB();


// =========================
// SECURITY
// =========================

app.disable(
    "x-powered-by"
);

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy:
                "cross-origin"
        }
    })
);


// =========================
// CORS
// =========================

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173"
].filter(Boolean);

app.use(
    cors({
        origin: (
            origin,
            callback
        ) => {
            // Allow tools such as
            // Postman / server requests
            if (!origin) {
                return callback(
                    null,
                    true
                );
            }

            if (
                allowedOrigins.includes(
                    origin
                )
            ) {
                return callback(
                    null,
                    true
                );
            }

            return callback(
                new Error(
                    "Not allowed by CORS"
                )
            );
        },

        credentials:
            true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// =========================
// BODY PARSING
// =========================

app.use(
    express.json({
        limit:
            "10mb"
    })
);

app.use(
    express.urlencoded({
        extended:
            true,

        limit:
            "10mb"
    })
);

app.use(
    cookieParser()
);


// =========================
// RATE LIMITERS
// =========================

const authLimiter =
    rateLimit({
        windowMs:
            15 *
            60 *
            1000,

        limit:
            100,

        standardHeaders:
            "draft-8",

        legacyHeaders:
            false,

        message: {
            success:
                false,

            message:
                "Too many authentication requests. Please try again later."
        }
    });

const contactLimiter =
    rateLimit({
        windowMs:
            15 *
            60 *
            1000,

        limit:
            20,

        standardHeaders:
            "draft-8",

        legacyHeaders:
            false,

        message: {
            success:
                false,

            message:
                "Too many messages. Please try again later."
        }
    });


// =========================
// HEALTH ROUTE
// =========================

app.get(
    "/api/health",
    (
        req,
        res
    ) => {
        res
            .status(200)
            .json({
                success:
                    true,

                message:
                    "Shivalik Dragon API is running."
            });
    }
);


// =========================
// ROOT
// =========================

app.get(
    "/",
    (
        req,
        res
    ) => {
        res.send(
            "Shivalik Dragon API"
        );
    }
);


// =========================
// ROUTES
// =========================

app.use(
    "/api/auth",
    authLimiter,
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);

app.use(
    "/api/contact",
    contactLimiter,
    contactRoutes
);
app.use(
    "/api/gallery",
    galleryRoutes
);

// =========================
// 404
// =========================

app.use(
    (
        req,
        res
    ) => {
        res
            .status(404)
            .json({
                success:
                    false,

                message:
                    "API route not found."
            });
    }
);


// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {
        console.error(
            "Server error:",
            error.message
        );

        if (
            error.message ===
            "Not allowed by CORS"
        ) {
            return res
                .status(403)
                .json({
                    success:
                        false,

                    message:
                        "Origin not allowed."
                });
        }

        res
            .status(500)
            .json({
                success:
                    false,

                message:
                    "Something went wrong."
            });
    }
);


// =========================
// SERVER
// =========================

const PORT =
    process.env.PORT ||
    5000;

app.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);