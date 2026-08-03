import {
    Check,
    ImagePlus,
    Images,
    Pencil,
    RefreshCcw,
    Sparkles,
    Trash2,
    Upload,
    X
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    motion
} from "framer-motion";

import {
    deleteGalleryImage,
    getGalleryImages,
    updateGalleryImage,
    uploadGalleryImage
} from "../../services/galleryService";

import {
    errorToast,
    successToast
} from "../../utils/showToast";

import "./adminGallery.css";


const categories = [
    "Farm",
    "Dragon Fruit",
    "Harvest",
    "Flowers",
    "Behind the Scenes",
    "Other"
];


const initialForm = {
    title: "",
    caption: "",
    category: "Farm",
    isFeatured: false
};


export default function AdminGallery() {
    const [
        images,
        setImages
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);

    const [
        uploading,
        setUploading
    ] = useState(false);

    const [
        deletingId,
        setDeletingId
    ] = useState(null);

    const [
        editingImage,
        setEditingImage
    ] = useState(null);

    const [
        editForm,
        setEditForm
    ] = useState(
        initialForm
    );

    const [
        form,
        setForm
    ] = useState(
        initialForm
    );

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);

    const [
        previewUrl,
        setPreviewUrl
    ] = useState("");

    const fileInputRef =
        useRef(null);


    // =========================
    // LOAD
    // =========================

    const loadImages =
        async (
            showRefresh = false
        ) => {
            try {
                if (
                    showRefresh
                ) {
                    setRefreshing(
                        true
                    );
                } else {
                    setLoading(
                        true
                    );
                }

                const response =
                    await getGalleryImages();

                setImages(
                    response.data
                        .images ||
                    []
                );

            } catch (error) {
                console.error(
                    "Gallery load error:",
                    error
                );

                errorToast(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load gallery."
                );

            } finally {
                setLoading(
                    false
                );

                setRefreshing(
                    false
                );
            }
        };


    useEffect(
        () => {
            loadImages();
        },
        []
    );


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange =
        event => {
            const {
                name,
                value,
                type,
                checked
            } = event.target;


            setForm(
                current => ({
                    ...current,

                    [name]:
                        type ===
                        "checkbox"
                            ? checked
                            : value
                })
            );
        };


    // =========================
    // FILE SELECT
    // =========================

    const handleFile =
        file => {
            if (!file) {
                return;
            }


            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {
                errorToast(
                    "Only JPG, PNG and WEBP images are allowed."
                );

                return;
            }


            if (
                file.size >
                8 *
                    1024 *
                    1024
            ) {
                errorToast(
                    "Image must be smaller than 8MB."
                );

                return;
            }


            if (
                previewUrl
            ) {
                URL.revokeObjectURL(
                    previewUrl
                );
            }


            const url =
                URL.createObjectURL(
                    file
                );


            setSelectedFile(
                file
            );

            setPreviewUrl(
                url
            );
        };


    const handleFileInput =
        event => {
            handleFile(
                event.target
                    .files?.[0]
            );
        };


    // =========================
    // DRAG DROP
    // =========================

    const handleDrop =
        event => {
            event.preventDefault();


            handleFile(
                event.dataTransfer
                    .files?.[0]
            );
        };


    // =========================
    // CLEAR FORM
    // =========================

    const resetForm =
        () => {
            if (
                previewUrl
            ) {
                URL.revokeObjectURL(
                    previewUrl
                );
            }


            setSelectedFile(
                null
            );

            setPreviewUrl(
                ""
            );

            setForm(
                initialForm
            );


            if (
                fileInputRef.current
            ) {
                fileInputRef.current.value =
                    "";
            }
        };


    // =========================
    // UPLOAD
    // =========================

    const handleUpload =
        async (
            event
        ) => {
            event.preventDefault();


            if (
                !selectedFile
            ) {
                errorToast(
                    "Please select an image."
                );

                return;
            }


            try {
                setUploading(
                    true
                );


                const data =
                    new FormData();


                data.append(
                    "image",
                    selectedFile
                );

                data.append(
                    "title",
                    form.title
                );

                data.append(
                    "caption",
                    form.caption
                );

                data.append(
                    "category",
                    form.category
                );

                data.append(
                    "isFeatured",
                    String(
                        form.isFeatured
                    )
                );


                await uploadGalleryImage(
                    data
                );


                successToast(
                    "Gallery image uploaded successfully."
                );


                resetForm();

                await loadImages(
                    true
                );

            } catch (error) {
                console.error(
                    "Gallery upload error:",
                    error
                );


                errorToast(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to upload image."
                );

            } finally {
                setUploading(
                    false
                );
            }
        };


    // =========================
    // EDIT
    // =========================

    const openEdit =
        image => {
            setEditingImage(
                image
            );


            setEditForm({
                title:
                    image.title ||
                    "",

                caption:
                    image.caption ||
                    "",

                category:
                    image.category ||
                    "Farm",

                isFeatured:
                    Boolean(
                        image.isFeatured
                    )
            });
        };


    const handleEditChange =
        event => {
            const {
                name,
                value,
                type,
                checked
            } = event.target;


            setEditForm(
                current => ({
                    ...current,

                    [name]:
                        type ===
                        "checkbox"
                            ? checked
                            : value
                })
            );
        };


    const handleUpdate =
        async () => {
            if (
                !editingImage
            ) {
                return;
            }


            try {
                await updateGalleryImage(
                    editingImage._id,
                    editForm
                );


                successToast(
                    "Gallery image updated."
                );


                setEditingImage(
                    null
                );


                await loadImages(
                    true
                );

            } catch (error) {
                console.error(
                    "Gallery update error:",
                    error
                );


                errorToast(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to update image."
                );
            }
        };


    // =========================
    // DELETE
    // =========================

    const handleDelete =
        async (
            image
        ) => {
            const confirmed =
                window.confirm(
                    `Delete "${image.title || "this image"}" from gallery?`
                );


            if (
                !confirmed
            ) {
                return;
            }


            try {
                setDeletingId(
                    image._id
                );


                await deleteGalleryImage(
                    image._id
                );


                setImages(
                    current =>
                        current.filter(
                            item =>
                                item._id !==
                                image._id
                        )
                );


                successToast(
                    "Gallery image deleted."
                );

            } catch (error) {
                console.error(
                    "Gallery delete error:",
                    error
                );


                errorToast(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to delete image."
                );

            } finally {
                setDeletingId(
                    null
                );
            }
        };


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="admin-gallery-page">

                <div className="admin-gallery-loading">

                    <div className="admin-gallery-loader" />

                    <span>
                        Loading gallery...
                    </span>

                </div>

            </section>
        );
    }


    return (
        <section className="admin-gallery-page">

            <div className="admin-gallery-glow admin-gallery-glow-one" />
            <div className="admin-gallery-glow admin-gallery-glow-two" />


            <div className="admin-gallery-container">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="admin-gallery-header">

                    <div>

                        <span>
                            GALLERY MANAGEMENT
                        </span>


                        <h1>
                            Manage
                            <strong>
                                {" "}
                                Gallery
                            </strong>
                        </h1>


                        <p>
                            Upload and manage
                            beautiful moments from
                            Shivalik Dragon Farm.
                        </p>

                    </div>


                    <button
                        type="button"

                        className="admin-gallery-refresh"

                        onClick={() =>
                            loadImages(
                                true
                            )
                        }

                        disabled={
                            refreshing
                        }
                    >
                        <RefreshCcw
                            size={17}

                            className={
                                refreshing
                                    ? "admin-gallery-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <div className="admin-gallery-summary">

                    <div className="admin-gallery-summary-icon">
                        <Images
                            size={22}
                        />
                    </div>


                    <div>
                        <span>
                            TOTAL IMAGES
                        </span>

                        <strong>
                            {
                                images.length
                            }
                        </strong>
                    </div>

                </div>


                {/* =========================
                    UPLOAD AREA
                ========================= */}

                <div className="admin-gallery-layout">

                    <form
                        className="admin-gallery-upload-card"

                        onSubmit={
                            handleUpload
                        }
                    >

                        <div className="admin-gallery-card-heading">

                            <div className="admin-gallery-heading-icon">
                                <ImagePlus
                                    size={21}
                                />
                            </div>


                            <div>
                                <h2>
                                    Add New Image
                                </h2>

                                <p>
                                    Upload a new farm
                                    moment to the public
                                    gallery.
                                </p>
                            </div>

                        </div>


                        {/* =========================
                            DROP ZONE
                        ========================= */}

                        <div
                            className={`admin-gallery-dropzone ${
                                previewUrl
                                    ? "has-image"
                                    : ""
                            }`}

                            onDragOver={
                                event =>
                                    event.preventDefault()
                            }

                            onDrop={
                                handleDrop
                            }

                            onClick={() =>
                                fileInputRef.current
                                    ?.click()
                            }
                        >

                            <input
                                ref={
                                    fileInputRef
                                }

                                type="file"

                                accept="image/jpeg,image/png,image/webp"

                                onChange={
                                    handleFileInput
                                }

                                hidden
                            />


                            {previewUrl ? (

                                <>
                                    <img
                                        src={
                                            previewUrl
                                        }

                                        alt="Upload preview"
                                    />


                                    <div className="admin-gallery-preview-overlay">

                                        <Upload
                                            size={24}
                                        />

                                        <span>
                                            Click to change image
                                        </span>

                                    </div>
                                </>

                            ) : (

                                <div className="admin-gallery-drop-content">

                                    <div className="admin-gallery-upload-icon">
                                        <Upload
                                            size={25}
                                        />
                                    </div>


                                    <strong>
                                        Drop your image here
                                    </strong>


                                    <span>
                                        or click to browse
                                    </span>


                                    <small>
                                        JPG, PNG or WEBP · Max 8MB
                                    </small>

                                </div>
                            )}

                        </div>


                        {/* =========================
                            DETAILS
                        ========================= */}

                        <div className="admin-gallery-form-grid">

                            <div className="admin-gallery-field">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"

                                    name="title"

                                    value={
                                        form.title
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    maxLength={
                                        120
                                    }

                                    placeholder="e.g. Fresh harvest morning"
                                />

                            </div>


                            <div className="admin-gallery-field">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"

                                    value={
                                        form.category
                                    }

                                    onChange={
                                        handleChange
                                    }
                                >

                                    {categories.map(
                                        category => (
                                            <option
                                                key={
                                                    category
                                                }

                                                value={
                                                    category
                                                }
                                            >
                                                {
                                                    category
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        <div className="admin-gallery-field">

                            <label>
                                Caption
                            </label>

                            <textarea
                                name="caption"

                                value={
                                    form.caption
                                }

                                onChange={
                                    handleChange
                                }

                                maxLength={
                                    500
                                }

                                placeholder="Add a short description about this moment..."
                            />

                            <small>
                                {
                                    form.caption
                                        .length
                                }
                                /500
                            </small>

                        </div>


                        <label className="admin-gallery-feature-toggle">

                            <input
                                type="checkbox"

                                name="isFeatured"

                                checked={
                                    form.isFeatured
                                }

                                onChange={
                                    handleChange
                                }
                            />


                            <span className="admin-gallery-toggle">
                                <span />
                            </span>


                            <div>
                                <strong>
                                    Feature this image
                                </strong>

                                <small>
                                    Featured images
                                    receive extra visual
                                    prominence in the
                                    gallery.
                                </small>
                            </div>

                        </label>


                        <button
                            type="submit"

                            className="admin-gallery-upload-button"

                            disabled={
                                uploading
                            }
                        >

                            {uploading ? (

                                <>
                                    <div className="admin-gallery-button-loader" />

                                    Uploading...
                                </>

                            ) : (

                                <>
                                    <Upload
                                        size={17}
                                    />

                                    Upload Image
                                </>

                            )}

                        </button>

                    </form>


                    {/* =========================
                        PREVIEW SIDE CARD
                    ========================= */}

                    <div className="admin-gallery-preview-card">

                        <span className="admin-gallery-preview-label">
                            PREVIEW
                        </span>


                        <h3>
                            How it will look
                        </h3>


                        <div className="admin-gallery-live-preview">

                            {previewUrl ? (

                                <>
                                    <img
                                        src={
                                            previewUrl
                                        }

                                        alt="Gallery preview"
                                    />


                                    <div className="admin-gallery-live-overlay">

                                        <span>
                                            {
                                                form.category
                                            }
                                        </span>


                                        <div>

                                            {form.title && (
                                                <h4>
                                                    {
                                                        form.title
                                                    }
                                                </h4>
                                            )}


                                            {form.caption && (
                                                <p>
                                                    {
                                                        form.caption
                                                    }
                                                </p>
                                            )}

                                        </div>

                                    </div>
                                </>

                            ) : (

                                <div className="admin-gallery-preview-empty">

                                    <Sparkles
                                        size={28}
                                    />

                                    <strong>
                                        Preview will appear here
                                    </strong>


                                    <span>
                                        Select an image
                                        to see how it
                                        will look in
                                        your gallery.
                                    </span>

                                </div>
                            )}

                        </div>

                    </div>

                </div>


                {/* =========================
                    EXISTING IMAGES
                ========================= */}

                <div className="admin-gallery-existing-header">

                    <div>
                        <span>
                            CURRENT GALLERY
                        </span>

                        <h2>
                            Uploaded Moments
                        </h2>
                    </div>

                </div>


                {images.length ===
                0 ? (

                    <div className="admin-gallery-empty">

                        <Images
                            size={32}
                        />


                        <h3>
                            No gallery images yet.
                        </h3>


                        <p>
                            Upload your first
                            farm moment above.
                        </p>

                    </div>

                ) : (

                    <div className="admin-gallery-grid">

                        {images.map(
                            (
                                image,
                                index
                            ) => (

                                <motion.article
                                    key={
                                        image._id
                                    }

                                    className="admin-gallery-image-card"

                                    initial={{
                                        opacity:
                                            0,

                                        y:
                                            18
                                    }}

                                    animate={{
                                        opacity:
                                            1,

                                        y:
                                            0
                                    }}

                                    transition={{
                                        delay:
                                            index *
                                            0.035
                                    }}
                                >

                                    <div className="admin-gallery-image-wrap">

                                        <img
                                            src={
                                                image.imageUrl
                                            }

                                            alt={
                                                image.title ||
                                                "Gallery image"
                                            }
                                        />


                                        <div className="admin-gallery-image-top">

                                            <span>
                                                {
                                                    image.category
                                                }
                                            </span>


                                            {image.isFeatured && (

                                                <span className="admin-gallery-featured-badge">
                                                    Featured
                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    <div className="admin-gallery-image-info">

                                        <h3>
                                            {image.title ||
                                                "Untitled moment"}
                                        </h3>


                                        {image.caption && (
                                            <p>
                                                {
                                                    image.caption
                                                }
                                            </p>
                                        )}


                                        <div className="admin-gallery-image-actions">

                                            <button
                                                type="button"

                                                className="admin-gallery-edit"

                                                onClick={() =>
                                                    openEdit(
                                                        image
                                                    )
                                                }
                                            >
                                                <Pencil
                                                    size={15}
                                                />

                                                Edit
                                            </button>


                                            <button
                                                type="button"

                                                className="admin-gallery-delete"

                                                onClick={() =>
                                                    handleDelete(
                                                        image
                                                    )
                                                }

                                                disabled={
                                                    deletingId ===
                                                    image._id
                                                }
                                            >
                                                <Trash2
                                                    size={15}
                                                />

                                                {deletingId ===
                                                image._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>

                                </motion.article>

                            )
                        )}

                    </div>
                )}

            </div>


            {/* =========================
                EDIT MODAL
            ========================= */}

            {editingImage && (

                <div
                    className="admin-gallery-modal-overlay"

                    onClick={() =>
                        setEditingImage(
                            null
                        )
                    }
                >

                    <div
                        className="admin-gallery-modal"

                        onClick={
                            event =>
                                event.stopPropagation()
                        }
                    >

                        <div className="admin-gallery-modal-header">

                            <div>

                                <span>
                                    EDIT IMAGE
                                </span>

                                <h2>
                                    Gallery Details
                                </h2>

                            </div>


                            <button
                                type="button"

                                onClick={() =>
                                    setEditingImage(
                                        null
                                    )
                                }
                            >
                                <X
                                    size={20}
                                />
                            </button>

                        </div>


                        <img
                            src={
                                editingImage.imageUrl
                            }

                            alt={
                                editingImage.title ||
                                "Gallery"
                            }

                            className="admin-gallery-modal-image"
                        />


                        <div className="admin-gallery-field">

                            <label>
                                Title
                            </label>

                            <input
                                type="text"

                                name="title"

                                value={
                                    editForm.title
                                }

                                onChange={
                                    handleEditChange
                                }
                            />

                        </div>


                        <div className="admin-gallery-field">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"

                                value={
                                    editForm.category
                                }

                                onChange={
                                    handleEditChange
                                }
                            >

                                {categories.map(
                                    category => (
                                        <option
                                            key={
                                                category
                                            }

                                            value={
                                                category
                                            }
                                        >
                                            {
                                                category
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        <div className="admin-gallery-field">

                            <label>
                                Caption
                            </label>

                            <textarea
                                name="caption"

                                value={
                                    editForm.caption
                                }

                                onChange={
                                    handleEditChange
                                }
                            />

                        </div>


                        <label className="admin-gallery-feature-toggle">

                            <input
                                type="checkbox"

                                name="isFeatured"

                                checked={
                                    editForm.isFeatured
                                }

                                onChange={
                                    handleEditChange
                                }
                            />


                            <span className="admin-gallery-toggle">
                                <span />
                            </span>


                            <div>
                                <strong>
                                    Featured image
                                </strong>

                                <small>
                                    Highlight this
                                    image in the
                                    public gallery.
                                </small>
                            </div>

                        </label>


                        <div className="admin-gallery-modal-actions">

                            <button
                                type="button"

                                className="admin-gallery-modal-cancel"

                                onClick={() =>
                                    setEditingImage(
                                        null
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"

                                className="admin-gallery-modal-save"

                                onClick={
                                    handleUpdate
                                }
                            >
                                <Check
                                    size={16}
                                />

                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </section>
    );
}