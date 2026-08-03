import {
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    ArrowLeft,
    ArrowRight
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    motion
} from "framer-motion";

import {
    useState
} from "react";

import toast from "react-hot-toast";

import {
    useCart
} from "../../context/CartContext";

import dragonFruitHero from "../../assets/images/dragon-fruit-hero.png";

import "./cart.css";

export default function Cart() {

    const navigate =
        useNavigate();

    const {
        items,
        subtotal,
        itemCount,
        cartLoading,
        updateQuantity,
        removeFromCart
    } = useCart();

    const [
        updatingId,
        setUpdatingId
    ] = useState(null);

    const [
        removingId,
        setRemovingId
    ] = useState(null);


    // =========================
    // UPDATE QUANTITY
    // =========================

    const handleQuantity =
        async (
            productId,
            quantity
        ) => {

            if (
                quantity < 1
            ) {
                return;
            }

            try {

                setUpdatingId(
                    productId
                );

                await updateQuantity(
                    productId,
                    quantity
                );

            } catch (error) {

                console.error(
                    "Update cart error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update quantity."
                );

            } finally {

                setUpdatingId(
                    null
                );
            }
        };


    // =========================
    // REMOVE PRODUCT
    // =========================

    const handleRemove =
        async (
            productId
        ) => {

            try {

                setRemovingId(
                    productId
                );

                await removeFromCart(
                    productId
                );

                toast.success(
                    "Product removed from cart."
                );

            } catch (error) {

                console.error(
                    "Remove cart error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to remove product."
                );

            } finally {

                setRemovingId(
                    null
                );
            }
        };


    // =========================
    // PRODUCT IMAGE
    // =========================

    const getProductImage =
        (
            product
        ) => {

            if (
                product.slug ===
                "dragon-fruit"
            ) {
                return dragonFruitHero;
            }

            if (
                product.images &&
                product.images.length >
                    0
            ) {
                return product.images[0];
            }

            return dragonFruitHero;
        };


    // =========================
    // LOADING
    // =========================

    if (cartLoading) {

        return (
            <section className="cart-page">

                <div className="cart-empty">

                    <div className="cart-empty-icon">

                        <ShoppingBag
                            size={34}
                        />

                    </div>

                    <h1>
                        Loading cart...
                    </h1>

                    <p>
                        Getting your cart
                        ready.
                    </p>

                </div>

            </section>
        );
    }


    // =========================
    // EMPTY CART
    // =========================

    if (
        !items ||
        items.length === 0
    ) {

        return (
            <section className="cart-page">

                <div className="cart-empty">

                    <div className="cart-empty-icon">

                        <ShoppingBag
                            size={38}
                        />

                    </div>

                    <h1>
                        Your cart is empty
                    </h1>

                    <p>
                        Add a product and it
                        will appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Explore Products

                    </button>

                </div>

            </section>
        );
    }


    // =========================
    // CART
    // =========================

    return (
        <section className="cart-page">

            <div className="cart-container">

                {/* =========================
                    HEADER
                ========================= */}

                <motion.div
                    className="cart-header"

                    initial={{
                        opacity: 0,
                        y: 20
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >

                    <span>
                        YOUR CART
                    </span>

                    <h1>
                        Review your
                        <strong>
                            {" "}
                            order.
                        </strong>
                    </h1>

                    <p>
                        Adjust quantities
                        before placing your
                        order.
                    </p>

                </motion.div>


                {/* =========================
                    CART LAYOUT
                ========================= */}

                <div className="cart-layout">

                    {/* =========================
                        ITEMS
                    ========================= */}

                    <div className="cart-items">

                        {items.map(
                            (
                                item,
                                index
                            ) => {

                                const product =
                                    item.product;

                                if (!product) {
                                    return null;
                                }

                                const quantity =
                                    Number(
                                        item.quantity ||
                                            0
                                    );

                                const price =
                                    Number(
                                        product.price ||
                                            0
                                    );

                                const lineTotal =
                                    price *
                                    quantity;

                                const isUpdating =
                                    updatingId ===
                                    product._id;

                                const isRemoving =
                                    removingId ===
                                    product._id;


                                return (

                                    <motion.div
                                        key={
                                            product._id
                                        }

                                        className="cart-item"

                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}

                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}

                                        transition={{
                                            delay:
                                                index *
                                                0.05
                                        }}
                                    >

                                        {/* IMAGE */}

                                        <div className="cart-item-image">

                                            <img
                                                src={
                                                    getProductImage(
                                                        product
                                                    )
                                                }

                                                alt={
                                                    product.name
                                                }
                                            />

                                        </div>


                                        {/* PRODUCT DETAILS */}

                                        <div className="cart-item-content">

                                            <span className="cart-item-category">

                                                {product.category ||
                                                    "Product"}

                                            </span>

                                            <h2>
                                                {
                                                    product.name
                                                }
                                            </h2>

                                            <p>

                                                ₹
                                                {price}

                                                /

                                                {
                                                    product.unit
                                                }

                                            </p>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="cart-item-actions">

                                            {/* QUANTITY */}

                                            <div className="cart-quantity">

                                                <button
                                                    type="button"

                                                    disabled={
                                                        isUpdating ||
                                                        isRemoving ||
                                                        quantity <=
                                                            1
                                                    }

                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            quantity -
                                                                1
                                                        )
                                                    }
                                                >

                                                    <Minus
                                                        size={15}
                                                    />

                                                </button>


                                                <span>

                                                    {isUpdating
                                                        ? "..."
                                                        : quantity}

                                                </span>


                                                <button
                                                    type="button"

                                                    disabled={
                                                        isUpdating ||
                                                        isRemoving
                                                    }

                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            quantity +
                                                                1
                                                        )
                                                    }
                                                >

                                                    <Plus
                                                        size={15}
                                                    />

                                                </button>

                                            </div>


                                            {/* TOTAL */}

                                            <strong className="cart-line-total">

                                                ₹
                                                {
                                                    lineTotal
                                                }

                                            </strong>


                                            {/* REMOVE */}

                                            <button
                                                type="button"

                                                className="cart-remove"

                                                disabled={
                                                    isRemoving ||
                                                    isUpdating
                                                }

                                                onClick={() =>
                                                    handleRemove(
                                                        product._id
                                                    )
                                                }

                                                aria-label={`Remove ${product.name}`}
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </motion.div>
                                );
                            }
                        )}


                        {/* CONTINUE SHOPPING */}

                        <button
                            className="continue-shopping"

                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                        >

                            <ArrowLeft
                                size={16}
                            />

                            Continue Shopping

                        </button>

                    </div>


                    {/* =========================
                        SUMMARY
                    ========================= */}

                    <motion.aside
                        className="cart-summary"

                        initial={{
                            opacity: 0,
                            x: 20
                        }}

                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                    >

                        <span className="cart-summary-label">
                            ORDER SUMMARY
                        </span>

                        <h2>
                            Summary
                        </h2>


                        {/* ITEMS */}

                        <div className="cart-summary-row">

                            <span>
                                Items
                            </span>

                            <strong>
                                {
                                    itemCount
                                }
                            </strong>

                        </div>


                        {/* SUBTOTAL */}

                        <div className="cart-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {
                                    subtotal
                                }
                            </strong>

                        </div>


                        <div className="cart-summary-divider" />


                        {/* TOTAL */}

                        <div className="cart-summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {
                                    subtotal
                                }
                            </strong>

                        </div>


                        {/* PAYMENT NOTE */}

                        <p className="cart-payment-note">

                            Payment will be
                            handled separately.
                            Your order will be
                            placed as unpaid.

                        </p>


                        {/* PLACE ORDER */}

                        <button
                            className="place-order-button"

                            onClick={() =>
                                navigate(
                                    "/checkout"
                                )
                            }
                        >

                            Place Order

                            <ArrowRight
                                size={17}
                            />

                        </button>

                    </motion.aside>

                </div>

            </div>

        </section>
    );
}