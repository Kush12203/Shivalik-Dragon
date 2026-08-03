import {
    Boxes,
    Check,
    Edit3,
    Image,
    IndianRupee,
    PackagePlus,
    Plus,
    RefreshCcw,
    Search,
    Star,
    Trash2,
    X
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    motion,
    AnimatePresence
} from "framer-motion";

import toast from "react-hot-toast";

import api from "../../services/api";

import dragonFruitHero from "../../assets/images/dragon-fruit-hero.png";

import "./adminProducts.css";

const emptyForm = {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: "",
    unit: "kg",
    imageUrl: "",
    category: "Fruit",
    stock: "",
    isAvailable: true,
    isFeatured: false
};

export default function AdminProducts() {
    const [
        products,
        setProducts
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
        search,
        setSearch
    ] = useState("");

    const [
        modalOpen,
        setModalOpen
    ] = useState(false);

    const [
        editingProduct,
        setEditingProduct
    ] = useState(null);

    const [
        form,
        setForm
    ] = useState(emptyForm);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        deletingId,
        setDeletingId
    ] = useState(null);

    const [
        deleteProduct,
        setDeleteProduct
    ] = useState(null);

    // =========================
    // LOAD PRODUCTS
    // =========================

    const loadProducts =
        async (
            refresh = false
        ) => {
            try {
                if (refresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response =
                    await api.get(
                        "/products"
                    );

                setProducts(
                    response.data.products ||
                    []
                );
            } catch (error) {
                console.error(
                    "Load products error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load products."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadProducts();
    }, []);

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
    // CREATE MODAL
    // =========================

    const openCreate =
        () => {
            setEditingProduct(
                null
            );

            setForm(
                emptyForm
            );

            setModalOpen(
                true
            );
        };

    // =========================
    // EDIT MODAL
    // =========================

    const openEdit =
        product => {
            setEditingProduct(
                product
            );

            setForm({
                name:
                    product.name ||
                    "",

                slug:
                    product.slug ||
                    "",

                shortDescription:
                    product.shortDescription ||
                    "",

                description:
                    product.description ||
                    "",

                price:
                    product.price ??
                    "",

                unit:
                    product.unit ||
                    "kg",

                imageUrl:
                    product.images?.[0] ||
                    "",

                category:
                    product.category ||
                    "Fruit",

                stock:
                    product.stock ??
                    "",

                isAvailable:
                    product.isAvailable !==
                    false,

                isFeatured:
                    Boolean(
                        product.isFeatured
                    )
            });

            setModalOpen(
                true
            );
        };

    // =========================
    // CLOSE MODAL
    // =========================

    const closeModal =
        () => {
            if (saving) {
                return;
            }

            setModalOpen(
                false
            );

            setEditingProduct(
                null
            );

            setForm(
                emptyForm
            );
        };

    // =========================
    // SAVE PRODUCT
    // =========================

    const handleSubmit =
        async event => {
            event.preventDefault();

            if (
                !form.name.trim()
            ) {
                toast.error(
                    "Product name is required."
                );

                return;
            }

            if (
                form.price === "" ||
                Number(
                    form.price
                ) < 0
            ) {
                toast.error(
                    "Enter a valid price."
                );

                return;
            }

            if (
                form.stock === "" ||
                Number(
                    form.stock
                ) < 0
            ) {
                toast.error(
                    "Enter valid stock."
                );

                return;
            }

            try {
                setSaving(true);

                const payload = {
                    name:
                        form.name.trim(),

                    shortDescription:
                        form.shortDescription
                            .trim(),

                    description:
                        form.description
                            .trim(),

                    price:
                        Number(
                            form.price
                        ),

                    unit:
                        form.unit.trim(),

                    category:
                        form.category.trim(),

                    stock:
                        Number(
                            form.stock
                        ),

                    isAvailable:
                        form.isAvailable,

                    isFeatured:
                        form.isFeatured,

                    images:
                        form.imageUrl.trim()
                            ? [
                                  form.imageUrl.trim()
                              ]
                            : []
                };

                if (
                    form.slug.trim()
                ) {
                    payload.slug =
                        form.slug
                            .trim()
                            .toLowerCase();
                }

                if (
                    editingProduct
                ) {
                    await api.put(
                        `/products/${editingProduct._id}`,
                        payload
                    );

                    toast.success(
                        "Product updated successfully."
                    );
                } else {
                    await api.post(
                        "/products",
                        payload
                    );

                    toast.success(
                        "Product created successfully."
                    );
                }

                closeModal();

                await loadProducts(
                    true
                );
            } catch (error) {
                console.error(
                    "Save product error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to save product."
                );
            } finally {
                setSaving(false);
            }
        };

    // =========================
    // DELETE
    // =========================

    const handleDelete =
        async () => {
            if (!deleteProduct) {
                return;
            }

            try {
                setDeletingId(
                    deleteProduct._id
                );

                await api.delete(
                    `/products/${deleteProduct._id}`
                );

                toast.success(
                    "Product deleted successfully."
                );

                setDeleteProduct(
                    null
                );

                await loadProducts(
                    true
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to delete product."
                );
            } finally {
                setDeletingId(
                    null
                );
            }
        };

    // =========================
    // QUICK TOGGLES
    // =========================

    const toggleAvailable =
        async product => {
            try {
                const response =
                    await api.put(
                        `/products/${product._id}`,
                        {
                            isAvailable:
                                !product.isAvailable
                        }
                    );

                setProducts(
                    current =>
                        current.map(
                            item =>
                                item._id ===
                                product._id
                                    ? response
                                          .data
                                          .product
                                    : item
                        )
                );

                toast.success(
                    response.data.product
                        .isAvailable
                        ? "Product is now available."
                        : "Product marked unavailable."
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update availability."
                );
            }
        };

    const toggleFeatured =
        async product => {
            try {
                const response =
                    await api.put(
                        `/products/${product._id}`,
                        {
                            isFeatured:
                                !product.isFeatured
                        }
                    );

                setProducts(
                    current =>
                        current.map(
                            item =>
                                item._id ===
                                product._id
                                    ? response
                                          .data
                                          .product
                                    : item
                        )
                );

                toast.success(
                    response.data.product
                        .isFeatured
                        ? "Product marked featured."
                        : "Featured status removed."
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update product."
                );
            }
        };

    // =========================
    // FILTER
    // =========================

    const filteredProducts =
        useMemo(
            () => {
                const term =
                    search
                        .trim()
                        .toLowerCase();

                if (!term) {
                    return products;
                }

                return products.filter(
                    product =>
                        product.name
                            ?.toLowerCase()
                            .includes(
                                term
                            ) ||
                        product.category
                            ?.toLowerCase()
                            .includes(
                                term
                            ) ||
                        product.slug
                            ?.toLowerCase()
                            .includes(
                                term
                            )
                );
            },
            [
                products,
                search
            ]
        );

    // =========================
    // SUMMARY
    // =========================

    const availableCount =
        products.filter(
            product =>
                product.isAvailable
        ).length;

    const featuredCount =
        products.filter(
            product =>
                product.isFeatured
        ).length;

    const totalStock =
        products.reduce(
            (
                total,
                product
            ) =>
                total +
                Number(
                    product.stock ||
                    0
                ),
            0
        );

    const getProductImage =
        product => {
            if (
                product.images?.[0]
            ) {
                return product.images[0];
            }

            if (
                product.slug ===
                "dragon-fruit"
            ) {
                return dragonFruitHero;
            }

            return null;
        };

    if (loading) {
        return (
            <section className="admin-products-page">
                <div className="admin-products-loading">
                    <div className="admin-products-loader" />

                    <span>
                        Loading products...
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-products-page">

            <div className="admin-products-container">

                {/* HEADER */}

                <motion.div
                    className="admin-products-header"

                    initial={{
                        opacity: 0,
                        y: 20
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >
                    <div>
                        <span>
                            PRODUCT MANAGEMENT
                        </span>

                        <h1>
                            Manage
                            <strong>
                                {" "}
                                products.
                            </strong>
                        </h1>

                        <p>
                            Add products,
                            update prices,
                            manage stock and
                            control what appears
                            on the website.
                        </p>
                    </div>

                    <div className="admin-products-header-actions">

                        <button
                            className="admin-products-refresh"
                            disabled={
                                refreshing
                            }
                            onClick={() =>
                                loadProducts(
                                    true
                                )
                            }
                        >
                            <RefreshCcw
                                size={15}
                                className={
                                    refreshing
                                        ? "admin-products-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>

                        <button
                            className="admin-add-product"
                            onClick={
                                openCreate
                            }
                        >
                            <Plus
                                size={17}
                            />

                            Add Product
                        </button>

                    </div>
                </motion.div>


                {/* SUMMARY */}

                <div className="admin-products-summary">

                    <div className="admin-product-summary-card">
                        <div className="product-summary-icon green">
                            <Boxes
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Products
                            </span>

                            <strong>
                                {
                                    products.length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-product-summary-card">
                        <div className="product-summary-icon blue">
                            <Check
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Available
                            </span>

                            <strong>
                                {
                                    availableCount
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-product-summary-card">
                        <div className="product-summary-icon gold">
                            <Star
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Featured
                            </span>

                            <strong>
                                {
                                    featuredCount
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-product-summary-card">
                        <div className="product-summary-icon pink">
                            <PackagePlus
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Total Stock
                            </span>

                            <strong>
                                {
                                    totalStock
                                }
                            </strong>
                        </div>
                    </div>

                </div>


                {/* SEARCH */}

                <div className="admin-products-toolbar">

                    <div className="admin-products-search">
                        <Search
                            size={16}
                        />

                        <input
                            value={
                                search
                            }
                            onChange={
                                event =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            placeholder="Search products..."
                        />
                    </div>

                    <span>
                        {
                            filteredProducts.length
                        }{" "}
                        product
                        {filteredProducts.length !==
                        1
                            ? "s"
                            : ""}
                    </span>

                </div>


                {/* PRODUCTS */}

                <div className="admin-products-grid">

                    {filteredProducts.map(
                        product => {
                            const image =
                                getProductImage(
                                    product
                                );

                            return (
                                <motion.article
                                    key={
                                        product._id
                                    }
                                    className="admin-product-card"

                                    initial={{
                                        opacity: 0,
                                        y: 15
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                >

                                    <div className="admin-product-image">

                                        {image ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />
                                        ) : (
                                            <div className="admin-product-no-image">
                                                <Image
                                                    size={29}
                                                />

                                                <span>
                                                    No image
                                                </span>
                                            </div>
                                        )}

                                        <div className="admin-product-image-badges">

                                            {product.isFeatured && (
                                                <span className="admin-featured-badge">
                                                    Featured
                                                </span>
                                            )}

                                            <span
                                                className={
                                                    product.isAvailable
                                                        ? "admin-availability available"
                                                        : "admin-availability unavailable"
                                                }
                                            >
                                                {product.isAvailable
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="admin-product-content">

                                        <span className="admin-product-category">
                                            {product.category ||
                                                "Product"}
                                        </span>

                                        <div className="admin-product-title-row">

                                            <h2>
                                                {
                                                    product.name
                                                }
                                            </h2>

                                            <strong>
                                                ₹
                                                {
                                                    product.price
                                                }
                                                <small>
                                                    /
                                                    {
                                                        product.unit
                                                    }
                                                </small>
                                            </strong>

                                        </div>

                                        <p>
                                            {product.shortDescription ||
                                                "No description provided."}
                                        </p>


                                        <div className="admin-product-info-row">

                                            <div>
                                                <span>
                                                    STOCK
                                                </span>

                                                <strong>
                                                    {
                                                        product.stock
                                                    }{" "}
                                                    {
                                                        product.unit
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    SLUG
                                                </span>

                                                <strong>
                                                    {
                                                        product.slug
                                                    }
                                                </strong>
                                            </div>

                                        </div>


                                        {/* TOGGLES */}

                                        <div className="admin-product-toggles">

                                            <button
                                                className={
                                                    product.isAvailable
                                                        ? "admin-toggle active"
                                                        : "admin-toggle"
                                                }
                                                onClick={() =>
                                                    toggleAvailable(
                                                        product
                                                    )
                                                }
                                            >
                                                <span />

                                                Available
                                            </button>

                                            <button
                                                className={
                                                    product.isFeatured
                                                        ? "admin-toggle featured active"
                                                        : "admin-toggle featured"
                                                }
                                                onClick={() =>
                                                    toggleFeatured(
                                                        product
                                                    )
                                                }
                                            >
                                                <Star
                                                    size={13}
                                                />

                                                Featured
                                            </button>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="admin-product-actions">

                                            <button
                                                className="admin-edit-product"
                                                onClick={() =>
                                                    openEdit(
                                                        product
                                                    )
                                                }
                                            >
                                                <Edit3
                                                    size={15}
                                                />

                                                Edit Product
                                            </button>

                                            <button
                                                className="admin-delete-product"
                                                onClick={() =>
                                                    setDeleteProduct(
                                                        product
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                </motion.article>
                            );
                        }
                    )}

                </div>

            </div>


            {/* =========================
                ADD / EDIT MODAL
            ========================= */}

            <AnimatePresence>
                {modalOpen && (
                    <div
                        className="admin-product-modal-overlay"

                        onClick={
                            closeModal
                        }
                    >

                        <motion.div
                            className="admin-product-modal"

                            initial={{
                                opacity: 0,
                                scale: 0.96,
                                y: 15
                            }}

                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0
                            }}

                            exit={{
                                opacity: 0,
                                scale: 0.96,
                                y: 10
                            }}

                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="admin-product-modal-header">

                                <div>
                                    <span>
                                        {editingProduct
                                            ? "EDIT PRODUCT"
                                            : "NEW PRODUCT"}
                                    </span>

                                    <h2>
                                        {editingProduct
                                            ? "Update product"
                                            : "Add product"}
                                    </h2>
                                </div>

                                <button
                                    onClick={
                                        closeModal
                                    }
                                >
                                    <X
                                        size={19}
                                    />
                                </button>

                            </div>


                            <form
                                className="admin-product-form"
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="admin-product-form-grid">

                                    <div className="admin-product-field">

                                        <label>
                                            Product Name *
                                        </label>

                                        <input
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Dragon Fruit"
                                        />

                                    </div>


                                    <div className="admin-product-field">

                                        <label>
                                            Slug
                                        </label>

                                        <input
                                            name="slug"
                                            value={
                                                form.slug
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="dragon-fruit"
                                        />

                                    </div>

                                </div>


                                <div className="admin-product-field">

                                    <label>
                                        Short Description
                                    </label>

                                    <input
                                        name="shortDescription"
                                        value={
                                            form.shortDescription
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Fresh premium dragon fruit."
                                    />

                                </div>


                                <div className="admin-product-field">

                                    <label>
                                        Full Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Product details..."
                                    />

                                </div>


                                <div className="admin-product-form-grid three">

                                    <div className="admin-product-field">

                                        <label>
                                            Price *
                                        </label>

                                        <div className="admin-product-price-input">

                                            <IndianRupee
                                                size={15}
                                            />

                                            <input
                                                name="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    form.price
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="admin-product-field">

                                        <label>
                                            Unit
                                        </label>

                                        <input
                                            name="unit"
                                            value={
                                                form.unit
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="kg"
                                        />

                                    </div>


                                    <div className="admin-product-field">

                                        <label>
                                            Stock
                                        </label>

                                        <input
                                            name="stock"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                form.stock
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>


                                <div className="admin-product-form-grid">

                                    <div className="admin-product-field">

                                        <label>
                                            Category
                                        </label>

                                        <input
                                            name="category"
                                            value={
                                                form.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Fruit"
                                        />

                                    </div>


                                    <div className="admin-product-field">

                                        <label>
                                            Image URL
                                        </label>

                                        <input
                                            name="imageUrl"
                                            value={
                                                form.imageUrl
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://..."
                                        />

                                    </div>

                                </div>


                                <div className="admin-product-checkboxes">

                                    <label>

                                        <input
                                            type="checkbox"
                                            name="isAvailable"
                                            checked={
                                                form.isAvailable
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            Available
                                        </span>

                                    </label>


                                    <label>

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

                                        <span>
                                            Featured
                                        </span>

                                    </label>

                                </div>


                                <div className="admin-product-modal-actions">

                                    <button
                                        type="button"
                                        className="admin-product-cancel"

                                        onClick={
                                            closeModal
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="admin-product-save"

                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingProduct
                                            ? "Save Changes"
                                            : "Create Product"}
                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </div>
                )}
            </AnimatePresence>


            {/* =========================
                DELETE CONFIRMATION
            ========================= */}

            <AnimatePresence>
                {deleteProduct && (
                    <div
                        className="admin-product-modal-overlay"

                        onClick={() =>
                            setDeleteProduct(
                                null
                            )
                        }
                    >

                        <motion.div
                            className="admin-delete-modal"

                            initial={{
                                opacity: 0,
                                scale: 0.95
                            }}

                            animate={{
                                opacity: 1,
                                scale: 1
                            }}

                            exit={{
                                opacity: 0,
                                scale: 0.95
                            }}

                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="admin-delete-icon">
                                <Trash2
                                    size={23}
                                />
                            </div>

                            <h2>
                                Delete product?
                            </h2>

                            <p>
                                Are you sure you
                                want to delete{" "}
                                <strong>
                                    {
                                        deleteProduct.name
                                    }
                                </strong>
                                ?
                            </p>

                            <div className="admin-delete-actions">

                                <button
                                    onClick={() =>
                                        setDeleteProduct(
                                            null
                                        )
                                    }
                                >
                                    Keep Product
                                </button>

                                <button
                                    className="danger"

                                    disabled={
                                        deletingId ===
                                        deleteProduct._id
                                    }

                                    onClick={
                                        handleDelete
                                    }
                                >
                                    {deletingId ===
                                    deleteProduct._id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>

                            </div>

                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

        </section>
    );
}