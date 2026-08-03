const Product =
    require(
        "../models/product"
    );


// =========================
// HELPERS
// =========================

const createSlug = (
    value
) => {
    return value
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        );
};

const isValidNumber = (
    value
) => {
    const number =
        Number(value);

    return (
        Number.isFinite(
            number
        ) &&
        number >= 0
    );
};


// =========================
// GET ALL PRODUCTS
// PUBLIC
// =========================

exports.getProducts = async (
    req,
    res
) => {
    try {
        const products =
            await Product
                .find()
                .sort({
                    isFeatured:
                        -1,

                    createdAt:
                        -1
                });

        res.status(200).json({
            success:
                true,

            count:
                products.length,

            products
        });
    } catch (error) {
        console.error(
            "Get products error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch products."
        });
    }
};


// =========================
// GET SINGLE PRODUCT
// PUBLIC
// =========================

exports.getProduct = async (
    req,
    res
) => {
    try {
        const slug =
            req.params.slug
                ?.trim()
                .toLowerCase();

        if (!slug) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Product slug is required."
                });
        }

        const product =
            await Product.findOne({
                slug
            });

        if (!product) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Product not found."
                });
        }

        res.status(200).json({
            success:
                true,

            product
        });
    } catch (error) {
        console.error(
            "Get product error:",
            error
        );

        res.status(500).json({
            success:
                false,

            message:
                "Unable to fetch product."
        });
    }
};


// =========================
// CREATE PRODUCT
// ADMIN
// =========================

exports.createProduct = async (
    req,
    res
) => {
    try {
        const {
            name,
            slug,
            shortDescription,
            description,
            price,
            unit,
            images,
            category,
            stock,
            isAvailable,
            isFeatured
        } = req.body;

        if (
            !name ||
            !name.trim()
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Product name is required."
                });
        }

        if (
            price === undefined ||
            price === null ||
            !isValidNumber(
                price
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Valid product price is required."
                });
        }

        if (
            stock !== undefined &&
            stock !== null &&
            !isValidNumber(
                stock
            )
        ) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Valid product stock is required."
                });
        }

        const productSlug =
            slug &&
            slug.trim()
                ? createSlug(
                      slug
                  )
                : createSlug(
                      name
                  );

        if (!productSlug) {
            return res
                .status(400)
                .json({
                    success:
                        false,

                    message:
                        "Unable to generate product slug."
                });
        }

        const existing =
            await Product.findOne({
                slug:
                    productSlug
            });

        if (existing) {
            return res
                .status(409)
                .json({
                    success:
                        false,

                    message:
                        "A product with this slug already exists."
                });
        }

        const numericPrice =
            Number(price);

        const numericStock =
            stock !==
                undefined &&
            stock !==
                null &&
            stock !==
                ""
                ? Number(
                      stock
                  )
                : 0;

        const product =
            await Product.create({
                name:
                    name.trim(),

                slug:
                    productSlug,

                shortDescription:
                    shortDescription
                        ?.trim() ||
                    "",

                description:
                    description
                        ?.trim() ||
                    "",

                price:
                    numericPrice,

                unit:
                    unit?.trim() ||
                    "kg",

                images:
                    Array.isArray(
                        images
                    )
                        ? images.filter(
                              image =>
                                  typeof image ===
                                      "string" &&
                                  image.trim()
                          )
                        : [],

                category:
                    category?.trim() ||
                    "Fruit",

                stock:
                    numericStock,

                isAvailable:
                    typeof isAvailable ===
                    "boolean"
                        ? isAvailable
                        : true,

                isFeatured:
                    typeof isFeatured ===
                    "boolean"
                        ? isFeatured
                        : false
            });

        res.status(201).json({
            success:
                true,

            message:
                "Product created successfully.",

            product
        });
    } catch (error) {
        console.error(
            "Create product error:",
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
                        "A product with this slug already exists."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to create product."
        });
    }
};


// =========================
// UPDATE PRODUCT
// ADMIN
// =========================

exports.updateProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Product not found."
                });
        }

        const {
            name,
            slug,
            shortDescription,
            description,
            price,
            unit,
            images,
            category,
            stock,
            isAvailable,
            isFeatured
        } = req.body;

        if (
            name !==
            undefined
        ) {
            if (
                !name ||
                !name.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Product name cannot be empty."
                    });
            }

            product.name =
                name.trim();
        }

        if (
            slug !==
            undefined
        ) {
            if (
                !slug ||
                !slug.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Product slug cannot be empty."
                    });
            }

            const normalizedSlug =
                createSlug(
                    slug
                );

            const existing =
                await Product.findOne({
                    slug:
                        normalizedSlug,

                    _id: {
                        $ne:
                            product._id
                    }
                });

            if (existing) {
                return res
                    .status(409)
                    .json({
                        success:
                            false,

                        message:
                            "Another product already uses this slug."
                    });
            }

            product.slug =
                normalizedSlug;
        }

        if (
            shortDescription !==
            undefined
        ) {
            product.shortDescription =
                String(
                    shortDescription
                ).trim();
        }

        if (
            description !==
            undefined
        ) {
            product.description =
                String(
                    description
                ).trim();
        }

        if (
            price !==
            undefined
        ) {
            if (
                price === null ||
                !isValidNumber(
                    price
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Valid product price is required."
                    });
            }

            product.price =
                Number(
                    price
                );
        }

        if (
            unit !==
            undefined
        ) {
            if (
                !String(
                    unit
                ).trim()
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Product unit cannot be empty."
                    });
            }

            product.unit =
                String(
                    unit
                ).trim();
        }

        if (
            images !==
            undefined
        ) {
            if (
                !Array.isArray(
                    images
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Product images must be an array."
                    });
            }

            product.images =
                images.filter(
                    image =>
                        typeof image ===
                            "string" &&
                        image.trim()
                );
        }

        if (
            category !==
            undefined
        ) {
            product.category =
                String(
                    category
                ).trim() ||
                "Fruit";
        }

        if (
            stock !==
            undefined
        ) {
            if (
                stock === null ||
                !isValidNumber(
                    stock
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Valid product stock is required."
                    });
            }

            product.stock =
                Number(
                    stock
                );
        }

        if (
            isAvailable !==
            undefined
        ) {
            if (
                typeof isAvailable !==
                "boolean"
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "isAvailable must be true or false."
                    });
            }

            product.isAvailable =
                isAvailable;
        }

        if (
            isFeatured !==
            undefined
        ) {
            if (
                typeof isFeatured !==
                "boolean"
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "isFeatured must be true or false."
                    });
            }

            product.isFeatured =
                isFeatured;
        }

        await product.save();

        res.status(200).json({
            success:
                true,

            message:
                "Product updated successfully.",

            product
        });
    } catch (error) {
        console.error(
            "Update product error:",
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
                        "Invalid product ID."
                });
        }

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
                        "Another product already uses this slug."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to update product."
        });
    }
};


// =========================
// DELETE PRODUCT
// ADMIN
// =========================

exports.deleteProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res
                .status(404)
                .json({
                    success:
                        false,

                    message:
                        "Product not found."
                });
        }

        await product.deleteOne();

        res.status(200).json({
            success:
                true,

            message:
                "Product deleted successfully."
        });
    } catch (error) {
        console.error(
            "Delete product error:",
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
                        "Invalid product ID."
                });
        }

        res.status(500).json({
            success:
                false,

            message:
                "Unable to delete product."
        });
    }
};