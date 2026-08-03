import {
    ArrowLeft,
    CheckCircle2,
    MapPin,
    PackageCheck,
    ShoppingBag
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import {
    useCart
} from "../../context/CartContext";

import {
    useAuth
} from "../../context/AuthContext";

import api from "../../services/api";

import "./checkout.css";

export default function Checkout() {

    const navigate =
        useNavigate();

    const {
        user
    } = useAuth();

    const {
        items,
        subtotal,
        clearCart
    } = useCart();

    const [
        placingOrder,
        setPlacingOrder
    ] = useState(false);

    const handlePlaceOrder =
        async () => {

            if (!user) {

                toast.error(
                    "Please sign in to place your order."
                );

                navigate(
                    "/signin"
                );

                return;
            }

            if (
                !items ||
                items.length === 0
            ) {

                toast.error(
                    "Your cart is empty."
                );

                navigate(
                    "/products"
                );

                return;
            }

            try {

                setPlacingOrder(
                    true
                );

                /*
                    IMPORTANT:

                    Backend reads the user's
                    MongoDB cart itself.

                    We do NOT send:
                    - price
                    - subtotal
                    - product name
                    - payment status
                    - order status

                    Backend handles all of it.
                */

                const response =
                    await api.post(
                        "/orders",
                        {}
                    );

                if (
                    response.data
                        .success
                ) {

                    /*
                        Backend has already
                        cleared MongoDB cart.

                        Now clear frontend
                        cart state too.
                    */

                    clearCart();

                    // toast.success(
                    //     "Order placed successfully!"
                    // );

                    navigate(
                        "/orders",
                        {
                            state: {
                                orderPlaced:
                                    true,

                                order:
                                    response
                                        .data
                                        .order
                            }
                        }
                    );
                }

            } catch (error) {

                console.error(
                    "Place order error:",
                    error
                );

                const message =
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to place order.";

                toast.error(
                    message
                );

            } finally {

                setPlacingOrder(
                    false
                );
            }
        };

    if (
        !items ||
        items.length === 0
    ) {

        return (
            <section className="checkout-page">

                <div className="checkout-empty">

                    <ShoppingBag
                        size={38}
                    />

                    <h1>
                        Nothing to checkout
                    </h1>

                    <p>
                        Your cart is
                        currently empty.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Explore Products
                    </button>

                </div>

            </section>
        );
    }

    return (
        <section className="checkout-page">

            <div className="checkout-container">

                <motion.div
                    className="checkout-header"

                    initial={{
                        opacity: 0,
                        y: 20
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >

                    <button
                        className="checkout-back"

                        onClick={() =>
                            navigate(
                                "/cart"
                            )
                        }
                    >

                        <ArrowLeft
                            size={15}
                        />

                        Back to Cart

                    </button>

                    <span>
                        CHECKOUT
                    </span>

                    <h1>
                        Almost
                        <strong>
                            {" "}
                            there.
                        </strong>
                    </h1>

                    <p>
                        Review your order
                        before confirming.
                    </p>

                </motion.div>


                <div className="checkout-layout">

                    {/* LEFT SIDE */}

                    <div className="checkout-main">

                        {/* ORDER DETAILS */}

                        <div className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="checkout-heading-icon">

                                    <PackageCheck
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Order Details
                                    </h2>

                                    <p>
                                        Review the products
                                        you're ordering.
                                    </p>

                                </div>

                            </div>


                            <div className="checkout-products">

                                {items.map(
                                    item => {

                                        const product =
                                            item.product;

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

                                        const itemTotal =
                                            price *
                                            quantity;

                                        return (

                                            <div
                                                className="checkout-product"

                                                key={
                                                    product._id
                                                }
                                            >

                                                <div>

                                                    <h3>
                                                        {
                                                            product.name
                                                        }
                                                    </h3>

                                                    <span>

                                                        {quantity}

                                                        {" "}

                                                        {
                                                            product.unit
                                                        }

                                                        {" × "}

                                                        ₹
                                                        {price}

                                                    </span>

                                                </div>

                                                <strong>
                                                    ₹
                                                    {
                                                        itemTotal
                                                    }
                                                </strong>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* COLLECTION */}

                        <div className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="checkout-heading-icon">

                                    <MapPin
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <h2>
                                         Order Collection
                                    </h2>

                                    <p>
                                        Collect your order
                                        directly from us.
                                    </p>

                                </div>

                            </div>


                            <div className="collection-box">

                                <CheckCircle2
                                    size={18}
                                />

                                <div>

                                    <strong>
                                        Direct Collection
                                    </strong>

                                    <span>
                                        Once your order is
                                        confirmed, collection
                                        details can be
                                        coordinated directly
                                        with Shivalik Dragon Farm.
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* PAYMENT */}

                        <div className="checkout-card">

                            <div className="checkout-card-heading">

                                <div>

                                    <h2>
                                        Payment
                                    </h2>

                                    <p>
                                        Payment is handled
                                        separately.
                                    </p>

                                </div>

                            </div>


                            <div className="collection-box">

                                <CheckCircle2
                                    size={18}
                                />

                                <div>

                                    <strong>
                                        Pay Later
                                    </strong>

                                    <span>
                                        You don't need to pay
                                        online. Your order will
                                        initially be marked as
                                        unpaid.
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT SUMMARY */}

                    <motion.aside
                        className="checkout-summary"

                        initial={{
                            opacity: 0,
                            x: 20
                        }}

                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                    >

                        <span className="checkout-summary-label">
                            ORDER SUMMARY
                        </span>

                        <h2>
                            Your Order
                        </h2>


                        <div className="checkout-summary-row">

                            <span>
                                Products
                            </span>

                            <strong>
                                {
                                    items.length
                                }
                            </strong>

                        </div>


                        <div className="checkout-summary-row">

                            <span>
                                Quantity
                            </span>

                            <strong>

                                {items.reduce(
                                    (
                                        total,
                                        item
                                    ) =>
                                        total +
                                        Number(
                                            item.quantity ||
                                            0
                                        ),
                                    0
                                )}

                            </strong>

                        </div>


                        <div className="checkout-divider" />


                        <div className="checkout-total">

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


                        <div className="checkout-payment-info">

                            <span>
                                PAYMENT METHOD
                            </span>

                            <strong>
                                Pay Later
                            </strong>

                            <p>
                                Payment will be
                                handled separately.
                                Your order will
                                initially remain
                                unpaid.
                            </p>

                        </div>


                        <button
                            className="confirm-order-button"

                            disabled={
                                placingOrder
                            }

                            onClick={
                                handlePlaceOrder
                            }
                        >

                            {placingOrder
                                ? "Placing Order..."
                                : "Confirm Order"}

                        </button>


                        <p className="checkout-secure">

                            <CheckCircle2
                                size={13}
                            />

                            Secure order
                            confirmation

                        </p>

                    </motion.aside>

                </div>

            </div>

        </section>
    );
}