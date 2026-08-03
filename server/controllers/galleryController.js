const streamifier =
    require("streamifier");

const Gallery =
    require(
        "../models/gallery"
    );

const cloudinary =
    require(
        "../config/cloudinary"
    );


// =========================
// CLOUDINARY STREAM UPLOAD
// =========================

const uploadBuffer =
    buffer => {
        return new Promise(
            (
                resolve,
                reject
            ) => {
                const stream =
                    cloudinary
                        .uploader
                        .upload_stream(
                            {
                                folder:
                                    "shivalik-dragon/gallery",

                                resource_type:
                                    "image",

                                transformation: [
                                    {
                                        quality:
                                            "auto"
                                    },

                                    {
                                        fetch_format:
                                            "auto"
                                    }
                                ]
                            },

                            (
                                error,
                                result
                            ) => {
                                if (
                                    error
                                ) {
                                    reject(
                                        error
                                    );

                                    return;
                                }

                                resolve(
                                    result
                                );
                            }
                        );


                streamifier
                    .createReadStream(
                        buffer
                    )
                    .pipe(
                        stream
                    );
            }
        );
    };


// =========================
// GET PUBLIC GALLERY
// =========================

exports.getGallery =
    async (
        req,
        res
    ) => {
        try {
            const {
                category
            } = req.query;


            const filter =
                {};


            if (
                category &&
                category !==
                    "All"
            ) {
                filter.category =
                    category;
            }


            const images =
                await Gallery
                    .find(
                        filter
                    )
                    .sort({
                        isFeatured:
                            -1,

                        createdAt:
                            -1
                    })
                    .populate(
                        "uploadedBy",
                        "fullName username"
                    );


            return res
                .status(200)
                .json({
                    success:
                        true,

                    count:
                        images.length,

                    images
                });

        } catch (error) {
            console.error(
                "Get gallery error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to load gallery."
                });
        }
    };


// =========================
// GET SINGLE IMAGE
// =========================

exports.getGalleryImage =
    async (
        req,
        res
    ) => {
        try {
            const image =
                await Gallery
                    .findById(
                        req.params.id
                    );


            if (!image) {
                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Gallery image not found."
                    });
            }


            return res
                .status(200)
                .json({
                    success:
                        true,

                    image
                });

        } catch (error) {
            console.error(
                "Get gallery image error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to load gallery image."
                });
        }
    };


// =========================
// UPLOAD IMAGE
// ADMIN
// =========================

exports.uploadGalleryImage =
    async (
        req,
        res
    ) => {
        try {
            if (
                !req.file
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "Please select an image."
                    });
            }


            const {
                title,
                caption,
                category,
                isFeatured
            } = req.body;


            const upload =
                await uploadBuffer(
                    req.file.buffer
                );


            const image =
                await Gallery.create(
                    {
                        title:
                            String(
                                title ||
                                    ""
                            )
                                .trim()
                                .slice(
                                    0,
                                    120
                                ),

                        caption:
                            String(
                                caption ||
                                    ""
                            )
                                .trim()
                                .slice(
                                    0,
                                    500
                                ),

                        category:
                            category ||
                            "Farm",

                        imageUrl:
                            upload.secure_url,

                        publicId:
                            upload.public_id,

                        isFeatured:
                            String(
                                isFeatured
                            ) ===
                            "true",

                        uploadedBy:
                            req.user._id
                    }
                );


            return res
                .status(201)
                .json({
                    success:
                        true,

                    message:
                        "Gallery image uploaded successfully.",

                    image
                });

        } catch (error) {
            console.error(
                "Upload gallery image error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to upload gallery image."
                });
        }
    };


// =========================
// UPDATE METADATA
// ADMIN
// =========================

exports.updateGalleryImage =
    async (
        req,
        res
    ) => {
        try {
            const image =
                await Gallery.findById(
                    req.params.id
                );


            if (!image) {
                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Gallery image not found."
                    });
            }


            const {
                title,
                caption,
                category,
                isFeatured
            } = req.body;


            if (
                title !==
                undefined
            ) {
                image.title =
                    String(
                        title
                    )
                        .trim()
                        .slice(
                            0,
                            120
                        );
            }


            if (
                caption !==
                undefined
            ) {
                image.caption =
                    String(
                        caption
                    )
                        .trim()
                        .slice(
                            0,
                            500
                        );
            }


            if (
                category !==
                undefined
            ) {
                image.category =
                    category;
            }


            if (
                isFeatured !==
                undefined
            ) {
                image.isFeatured =
                    Boolean(
                        isFeatured
                    );
            }


            await image.save();


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Gallery image updated successfully.",

                    image
                });

        } catch (error) {
            console.error(
                "Update gallery image error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to update gallery image."
                });
        }
    };


// =========================
// DELETE IMAGE
// ADMIN
// =========================

exports.deleteGalleryImage =
    async (
        req,
        res
    ) => {
        try {
            const image =
                await Gallery.findById(
                    req.params.id
                );


            if (!image) {
                return res
                    .status(404)
                    .json({
                        success:
                            false,

                        message:
                            "Gallery image not found."
                    });
            }


            try {
                await cloudinary
                    .uploader
                    .destroy(
                        image.publicId
                    );

            } catch (
                cloudinaryError
            ) {
                console.error(
                    "Cloudinary delete error:",
                    cloudinaryError
                );
            }


            await image.deleteOne();


            return res
                .status(200)
                .json({
                    success:
                        true,

                    message:
                        "Gallery image deleted successfully."
                });

        } catch (error) {
            console.error(
                "Delete gallery image error:",
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to delete gallery image."
                });
        }
    };