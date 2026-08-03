const mongoose =
    require("mongoose");


const gallerySchema =
    new mongoose.Schema(
        {
            title: {
                type:
                    String,

                trim:
                    true,

                maxlength:
                    120,

                default:
                    ""
            },

            caption: {
                type:
                    String,

                trim:
                    true,

                maxlength:
                    500,

                default:
                    ""
            },

            category: {
                type:
                    String,

                trim:
                    true,

                enum: [
                    "Farm",
                    "Dragon Fruit",
                    "Harvest",
                    "Flowers",
                    "Behind the Scenes",
                    "Other"
                ],

                default:
                    "Farm"
            },

            imageUrl: {
                type:
                    String,

                required:
                    true
            },

            publicId: {
                type:
                    String,

                required:
                    true
            },

            isFeatured: {
                type:
                    Boolean,

                default:
                    false
            },

            uploadedBy: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,

                ref:
                    "User",

                required:
                    true
            }
        },
        {
            timestamps:
                true
        }
    );


gallerySchema.index({
    createdAt:
        -1
});


module.exports =
    mongoose.model(
        "Gallery",
        gallerySchema
    );