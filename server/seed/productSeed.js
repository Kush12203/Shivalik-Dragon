require("dotenv").config();

const mongoose =
    require("mongoose");

const connectDB =
    require("../config/db");

   const Product = require("../models/product");

const seedProduct =
    async () => {
        try {
            await connectDB();

            const existing =
                await Product.findOne({
                    slug:
                        "dragon-fruit"
                });

            if (existing) {
                console.log(
                    "Dragon Fruit already exists."
                );

                await mongoose.connection.close();

                return;
            }

            const product =
                await Product.create(
                    {
                        name:
                            "Dragon Fruit",

                        slug:
                            "dragon-fruit",

                        shortDescription:
                            "Fresh premium dragon fruit.",

                        description:
                            "Freshly selected dragon fruit available for direct ordering.",

                        price: 0,

                        unit: "kg",

                        category:
                            "Fruit",

                        stock: 0,

                        isAvailable:
                            true,

                        isFeatured:
                            true,

                        images: []
                    }
                );

            console.log(
                "Product created:",
                product.name
            );

            await mongoose.connection.close();
        } catch (error) {
            console.error(
                "Product seed failed:",
                error
            );

            await mongoose.connection.close();

            process.exit(1);
        }
    };

seedProduct();