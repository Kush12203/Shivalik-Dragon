import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Package,
    RefreshCcw,
    ShoppingBag,
    XCircle
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import api from "../../services/api";

import "./orders.css";

export default function Orders() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [
        orders,
        setOrders
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
        cancellingId,
        setCancellingId
    ] = useState(null);

    const [
        cancelReason,
        setCancelReason
    ] = useState("");

    const [
        cancelModal,
        setCancelModal
    ] = useState(null);

    // =========================
    // LOAD ORDERS
    // =========================

    const loadOrders =
        async (
            showRefresh = false
        ) => {
            try {
                if (showRefresh) {
                    setRefreshing(
                        true
                    );
                } else {
                    setLoading(
                        true
                    );
                }

                const response =
                    await api.get(
                        "/orders/my"
                    );

                setOrders(
                    response.data.orders ||
                        []
                );
            } catch (error) {
                console.error(
                    "Load orders error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load your orders."
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

  useEffect(() => {
    loadOrders();

    if (location.state?.orderPlaced) {
        toast.success(
            "Your order has been placed successfully.",
            {
                id: "order-placed-success"
            }
        );

        navigate(
            location.pathname,
            {
                replace: true,
                state: {}
            }
        );
    }
}, []);

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate =
        date => {
            if (!date) {
                return "-";
            }

            return new Date(
                date
            ).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        };

    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass =
        status => {
            switch (status) {
                case "Pending":
                    return "pending";

                case "Confirmed":
                    return "confirmed";

                case "Ready":
                    return "ready";

                case "Completed":
                    return "completed";

                case "Cancelled":
                    return "cancelled";

                default:
                    return "";
            }
        };

    // =========================
    // OPEN CANCEL
    // =========================

    const openCancelModal =
        order => {
            setCancelReason(
                ""
            );

            setCancelModal(
                order
            );
        };

    // =========================
    // CANCEL ORDER
    // =========================

    const handleCancel =
        async () => {
            if (!cancelModal) {
                return;
            }

            try {
                setCancellingId(
                    cancelModal._id
                );

                await api.patch(
                    `/orders/${cancelModal._id}/cancel`,
                    {
                        reason:
                            cancelReason.trim() ||
                            "Cancelled by customer"
                    }
                );

                toast.success(
                    "Order cancelled successfully."
                );

                setCancelModal(
                    null
                );

                setCancelReason(
                    ""
                );

                await loadOrders(
                    true
                );
            } catch (error) {
                console.error(
                    "Cancel order error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to cancel this order."
                );
            } finally {
                setCancellingId(
                    null
                );
            }
        };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="orders-page">

                <div className="orders-loading">

                    <div className="orders-loader" />

                    <span>
                        Loading your orders...
                    </span>

                </div>

            </section>
        );
    }

    // =========================
    // EMPTY
    // =========================

    if (
        orders.length === 0
    ) {
        return (
            <section className="orders-page">

                <div className="orders-empty">

                    <div className="orders-empty-icon">
                        <ShoppingBag
                            size={36}
                        />
                    </div>

                    <h1>
                        No orders yet
                    </h1>

                    <p>
                        Once you place an
                        order, it will appear
                        here.
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
        <section className="orders-page">

            <div className="orders-container">

                {/* HEADER */}

                <motion.div
                    className="orders-header"

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
                            MY ORDERS
                        </span>

                        <h1>
                            Order
                            <strong>
                                {" "}
                                history.
                            </strong>
                        </h1>

                        <p>
                            View your current
                            and previous orders
                            in one place.
                        </p>

                    </div>

                    <button
                        className="orders-refresh"

                        disabled={
                            refreshing
                        }

                        onClick={() =>
                            loadOrders(
                                true
                            )
                        }
                    >
                        <RefreshCcw
                            size={15}
                            className={
                                refreshing
                                    ? "spin-icon"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </motion.div>


                {/* ORDER CARDS */}

                <div className="orders-list">

                    {orders.map(
                        (
                            order,
                            index
                        ) => {

                            const canCancel =
                                [
                                    "Pending",
                                    "Confirmed"
                                ].includes(
                                    order.orderStatus
                                );

                            return (

                                <motion.article
                                    key={
                                        order._id
                                    }

                                    className="order-card"

                                    initial={{
                                        opacity:
                                            0,
                                        y:
                                            20
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
                                            0.05
                                    }}
                                >

                                    {/* TOP */}

                                    <div className="order-card-top">

                                        <div>

                                            <span className="order-number-label">
                                                ORDER NUMBER
                                            </span>

                                            <h2>
                                                {
                                                    order.orderNumber
                                                }
                                            </h2>

                                        </div>


                                        <div className="order-badges">

                                            <span
                                                className={`order-status ${getStatusClass(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {
                                                    order.orderStatus
                                                }
                                            </span>

                                            <span
                                                className={
                                                    order.paymentStatus ===
                                                    "Paid"
                                                        ? "payment-status paid"
                                                        : "payment-status unpaid"
                                                }
                                            >
                                                {
                                                    order.paymentStatus
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* META */}

                                    <div className="order-meta">

                                        <div>
                                            <CalendarDays
                                                size={
                                                    15
                                                }
                                            />

                                            <span>
                                                {
                                                    formatDate(
                                                        order.placedAt ||
                                                        order.createdAt
                                                    )
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <Package
                                                size={
                                                    15
                                                }
                                            />

                                            <span>
                                                {
                                                    order.items
                                                        ?.length ||
                                                    0
                                                }{" "}
                                                product
                                                {order.items
                                                    ?.length !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>

                                    </div>


                                    {/* ITEMS */}

                                    <div className="order-items">

                                        {order.items?.map(
                                            (
                                                item,
                                                itemIndex
                                            ) => (

                                                <div
                                                    className="order-item-row"

                                                    key={`${order._id}-${itemIndex}`}
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                item.productName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                item.quantity
                                                            }{" "}
                                                            {
                                                                item.unit
                                                            }{" "}
                                                            × ₹
                                                            {
                                                                item.price
                                                            }
                                                        </span>

                                                    </div>

                                                    <strong className="order-item-total">
                                                        ₹
                                                        {
                                                            item.subtotal
                                                        }
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* FOOTER */}

                                    <div className="order-card-footer">

                                        <div className="order-total">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    order.totalAmount
                                                }
                                            </strong>

                                        </div>


                                        <div className="order-actions">

                                            {canCancel && (
                                                <button
                                                    className="cancel-order-button"

                                                    onClick={() =>
                                                        openCancelModal(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <XCircle
                                                        size={
                                                            15
                                                        }
                                                    />

                                                    Cancel Order
                                                </button>
                                            )}

                                            {order.orderStatus ===
                                                "Completed" && (
                                                <span className="completed-order-message">

                                                    <CheckCircle2
                                                        size={
                                                            15
                                                        }
                                                    />

                                                    Completed

                                                </span>
                                            )}

                                        </div>

                                    </div>


                                    {/* CANCELLATION INFO */}

                                    {order.orderStatus ===
                                        "Cancelled" && (
                                        <div className="order-cancel-info">

                                            <XCircle
                                                size={
                                                    15
                                                }
                                            />

                                            <div>

                                                <strong>
                                                    Order Cancelled
                                                </strong>

                                                {order.cancellationReason && (
                                                    <span>
                                                        {
                                                            order.cancellationReason
                                                        }
                                                    </span>
                                                )}

                                            </div>

                                        </div>
                                    )}

                                </motion.article>

                            );
                        }
                    )}

                </div>

            </div>


            {/* CANCEL MODAL */}

            {cancelModal && (

                <div
                    className="cancel-modal-overlay"

                    onClick={() =>
                        setCancelModal(
                            null
                        )
                    }
                >

                    <motion.div
                        className="cancel-modal"

                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 15
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}

                        onClick={
                            event =>
                                event.stopPropagation()
                        }
                    >

                        <div className="cancel-modal-icon">
                            <XCircle
                                size={24}
                            />
                        </div>

                        <h2>
                            Cancel this order?
                        </h2>

                        <p>
                            You're cancelling
                            <strong>
                                {" "}
                                {
                                    cancelModal.orderNumber
                                }
                            </strong>
                            .
                        </p>

                        <label>
                            Reason
                        </label>

                        <textarea
                            maxLength={
                                200
                            }

                            placeholder="Why are you cancelling this order?"

                            value={
                                cancelReason
                            }

                            onChange={
                                event =>
                                    setCancelReason(
                                        event.target.value
                                    )
                            }
                        />

                        <div className="cancel-modal-actions">

                            <button
                                className="keep-order-button"

                                onClick={() =>
                                    setCancelModal(
                                        null
                                    )
                                }
                            >
                                Keep Order
                            </button>

                            <button
                                className="confirm-cancel-button"

                                disabled={
                                    cancellingId ===
                                    cancelModal._id
                                }

                                onClick={
                                    handleCancel
                                }
                            >
                                {cancellingId ===
                                cancelModal._id
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                            </button>

                        </div>

                    </motion.div>

                </div>

            )}

        </section>
    );
}