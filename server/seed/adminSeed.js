require("dotenv").config();

const mongoose =
    require("mongoose");

const bcrypt =
    require("bcryptjs");

const connectDB =
    require("../config/db");

const User = require("../models/user");

const seedAdmin =
    async () => {
        try {
            await connectDB();

            const username =
                process.env
                    .INITIAL_ADMIN_USERNAME
                    ?.trim()
                    .toLowerCase();

            const password =
                process.env
                    .INITIAL_ADMIN_PASSWORD;

            if (
                !username ||
                !password
            ) {
                console.log(
                    "Initial admin credentials missing from .env"
                );

                await mongoose.connection.close();

                return;
            }

            if (
                password.length <
                8
            ) {
                console.log(
                    "Initial admin password must contain at least 8 characters."
                );

                await mongoose.connection.close();

                return;
            }

            const existing =
                await User.findOne({
                    username
                });

            if (existing) {
                console.log(
                    "Initial admin already exists."
                );

                await mongoose.connection.close();

                return;
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

            const admin =
                await User.create({
                    fullName:
                        "Shivalik",

                    username,

                    password:
                        hashedPassword,

                    role:
                        "superadmin",

                    authProvider:
                        "local",

                    isActive:
                        true
                });

            console.log(
                "Superadmin created:",
                admin.username
            );

            await mongoose.connection.close();
        } catch (error) {
            console.error(
                "Admin seed failed:",
                error
            );

            await mongoose.connection.close();

            process.exit(1);
        }
    };

seedAdmin();