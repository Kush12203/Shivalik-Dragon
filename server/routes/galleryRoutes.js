const express =
    require("express");

const multer =
    require("multer");

const router =
    express.Router();

const galleryController =
    require(
        "../controllers/galleryController"
    );

const {
    protect,
    adminOnly
} = require(
    "../middleware/authMiddleware"
);


// =========================
// MULTER MEMORY STORAGE
// =========================

const storage =
    multer.memoryStorage();


const upload =
    multer({
        storage,

        limits: {
            fileSize:
                8 *
                1024 *
                1024
        },

        fileFilter: (
            req,
            file,
            callback
        ) => {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    file.mimetype
                )
            ) {
                return callback(
                    new Error(
                        "Only JPG, PNG and WEBP images are allowed."
                    )
                );
            }


            callback(
                null,
                true
            );
        }
    });


// =========================
// PUBLIC
// =========================

router.get(
    "/",
    galleryController.getGallery
);


router.get(
    "/:id",
    galleryController.getGalleryImage
);


// =========================
// ADMIN
// =========================

router.post(
    "/",
    protect,
    adminOnly,
    upload.single(
        "image"
    ),
    galleryController.uploadGalleryImage
);


router.put(
    "/:id",
    protect,
    adminOnly,
    galleryController.updateGalleryImage
);


router.delete(
    "/:id",
    protect,
    adminOnly,
    galleryController.deleteGalleryImage
);


module.exports =
    router;