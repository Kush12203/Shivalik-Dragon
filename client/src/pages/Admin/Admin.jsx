import {
    CheckCircle2,
    Clock3,
    IndianRupee,
    Package,
    RefreshCcw,
    Search,
    ShoppingBag,
    UserRound,
    XCircle
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import api from "../../services/api";

import "./admin.css";

export default function Admin() {
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
        updatingId,
        setUpdatingId
    ] = useState(null);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("All");

    const [
        paymentFilter,
        setPaymentFilter
    ] = useState("All");

    // =========================
    // LOAD ORDERS
    // =========================

    const loadOrders =
        async (
            showRefresh = false
        ) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const response =
                    await api.get(
                        "/orders/admin/all"
                    );

                setOrders(
                    response.data.orders ||
                    []
                );
            } catch (error) {
                console.error(
                    "Admin orders error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load orders."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadOrders();
    }, []);

    // =========================
    // ORDER STATUS
    // =========================

    const updateOrderStatus =
        async (
            orderId,
            orderStatus
        ) => {
            try {
                setUpdatingId(
                    orderId
                );

                const response =
                    await api.patch(
                        `/orders/admin/${orderId}/status`,
                        {
                            orderStatus
                        }
                    );

                setOrders(
                    current =>
                        current.map(
                            order =>
                                order._id ===
                                orderId
                                    ? response
                                          .data
                                          .order
                                    : order
                        )
                );

                toast.success(
                    `Order marked ${orderStatus}.`
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update order status."
                );
            } finally {
                setUpdatingId(
                    null
                );
            }
        };

    // =========================
    // PAYMENT STATUS
    // =========================

    const updatePaymentStatus =
        async (
            orderId,
            paymentStatus
        ) => {
            try {
                setUpdatingId(
                    orderId
                );

                const response =
                    await api.patch(
                        `/orders/admin/${orderId}/payment`,
                        {
                            paymentStatus
                        }
                    );

                setOrders(
                    current =>
                        current.map(
                            order =>
                                order._id ===
                                orderId
                                    ? response
                                          .data
                                          .order
                                    : order
                        )
                );

                toast.success(
                    `Payment marked ${paymentStatus}.`
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update payment status."
                );
            } finally {
                setUpdatingId(
                    null
                );
            }
        };

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
    // FILTER ORDERS
    // =========================

    const filteredOrders =
        useMemo(
            () => {
                const term =
                    search
                        .trim()
                        .toLowerCase();

                return orders.filter(
                    order => {
                        const customer =
                            order.customer ||
                            {};

                        const matchesSearch =
                            !term ||
                            order.orderNumber
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            customer.fullName
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            customer.email
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            customer.phone
                                ?.toLowerCase()
                                .includes(
                                    term
                                );

                        const matchesStatus =
                            statusFilter ===
                                "All" ||
                            order.orderStatus ===
                                statusFilter;

                        const matchesPayment =
                            paymentFilter ===
                                "All" ||
                            order.paymentStatus ===
                                paymentFilter;

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesPayment
                        );
                    }
                );
            },
            [
                orders,
                search,
                statusFilter,
                paymentFilter
            ]
        );

    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(
            () => {
                return {
                    total:
                        orders.length,

                    pending:
                        orders.filter(
                            order =>
                                order.orderStatus ===
                                "Pending"
                        ).length,

                    unpaid:
                        orders.filter(
                            order =>
                                order.paymentStatus ===
                                "Unpaid"
                        ).length,

                    revenue:
                        orders
                            .filter(
                                order =>
                                    order.paymentStatus ===
                                    "Paid"
                            )
                            .reduce(
                                (
                                    total,
                                    order
                                ) =>
                                    total +
                                    Number(
                                        order.totalAmount ||
                                        0
                                    ),
                                0
                            )
                };
            },
            [orders]
        );

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="admin-page">
                <div className="admin-loading">
                    <div className="admin-loader" />

                    <span>
                        Loading admin dashboard...
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-page">
            <div className="admin-container">

                {/* HEADER */}

                <motion.div
                    className="admin-header"
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
                            ADMIN CONTROL
                        </span>

                        <h1>
                            Orders
                            <strong>
                                {" "}
                                dashboard.
                            </strong>
                        </h1>

                        <p>
                            Review customer
                            orders, update order
                            progress and manage
                            payment status.
                        </p>
                    </div>

                    <button
                        className="admin-refresh"
                        disabled={
                            refreshing
                        }
                        onClick={() =>
                            loadOrders(true)
                        }
                    >
                        <RefreshCcw
                            size={15}
                            className={
                                refreshing
                                    ? "admin-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </motion.div>


                {/* SUMMARY */}

                <div className="admin-summary-grid">

                    <div className="admin-summary-card">
                        <div className="admin-summary-icon green">
                            <ShoppingBag
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {
                                    summary.total
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-summary-card">
                        <div className="admin-summary-icon orange">
                            <Clock3
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {
                                    summary.pending
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-summary-card">
                        <div className="admin-summary-icon red">
                            <XCircle
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Unpaid
                            </span>

                            <strong>
                                {
                                    summary.unpaid
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-summary-card">
                        <div className="admin-summary-icon blue">
                            <IndianRupee
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Paid Amount
                            </span>

                            <strong>
                                ₹
                                {
                                    summary.revenue
                                }
                            </strong>
                        </div>
                    </div>

                </div>


                {/* FILTERS */}

                <div className="admin-filters">

                    <div className="admin-search">
                        <Search
                            size={16}
                        />

                        <input
                            type="text"
                            placeholder="Search order, customer, email or phone..."
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
                        />
                    </div>

                    <select
                        value={
                            statusFilter
                        }
                        onChange={
                            event =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                        }
                    >
                        <option value="All">
                            All Statuses
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Confirmed">
                            Confirmed
                        </option>

                        <option value="Ready">
                            Ready
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>

                    <select
                        value={
                            paymentFilter
                        }
                        onChange={
                            event =>
                                setPaymentFilter(
                                    event
                                        .target
                                        .value
                                )
                        }
                    >
                        <option value="All">
                            All Payments
                        </option>

                        <option value="Unpaid">
                            Unpaid
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Failed">
                            Failed
                        </option>

                        <option value="Refunded">
                            Refunded
                        </option>
                    </select>

                </div>


                {/* RESULTS */}

                <div className="admin-results-line">
                    Showing{" "}
                    <strong>
                        {
                            filteredOrders.length
                        }
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {
                            orders.length
                        }
                    </strong>{" "}
                    orders
                </div>


                {/* ORDERS */}

                <div className="admin-orders-list">

                    {filteredOrders.length ===
                    0 ? (
                        <div className="admin-empty">
                            <Package
                                size={34}
                            />

                            <h3>
                                No matching orders
                            </h3>

                            <p>
                                Try changing your
                                search or filters.
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map(
                            (
                                order,
                                index
                            ) => {

                                const customer =
                                    order.customer ||
                                    {};

                                return (
                                    <motion.article
                                        className="admin-order-card"
                                        key={
                                            order._id
                                        }
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
                                                0.03
                                        }}
                                    >

                                        {/* ORDER HEADER */}

                                        <div className="admin-order-top">

                                            <div>
                                                <span>
                                                    ORDER
                                                </span>

                                                <h2>
                                                    {
                                                        order.orderNumber
                                                    }
                                                </h2>

                                                <small>
                                                    {
                                                        formatDate(
                                                            order.placedAt ||
                                                            order.createdAt
                                                        )
                                                    }
                                                </small>
                                            </div>

                                            <div className="admin-order-total">
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

                                        </div>


                                        {/* CUSTOMER */}

                                        <div className="admin-customer">

                                            <div className="admin-customer-icon">
                                                <UserRound
                                                    size={19}
                                                />
                                            </div>

                                            <div>
                                                <span>
                                                    CUSTOMER
                                                </span>

                                                <strong>
                                                    {customer.fullName ||
                                                        customer.username ||
                                                        "Customer"}
                                                </strong>

                                                <small>
                                                    {customer.email ||
                                                        "-"}

                                                    {customer.phone &&
                                                        ` • ${customer.phone}`}
                                                </small>
                                            </div>

                                        </div>


                                        {/* ITEMS */}

                                        <div className="admin-order-items">

                                            {order.items?.map(
                                                (
                                                    item,
                                                    itemIndex
                                                ) => (
                                                    <div
                                                        className="admin-order-item"
                                                        key={
                                                            itemIndex
                                                        }
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

                                                        <strong>
                                                            ₹
                                                            {
                                                                item.subtotal
                                                            }
                                                        </strong>
                                                    </div>
                                                )
                                            )}

                                        </div>


                                        {/* CONTROLS */}

                                        <div className="admin-order-controls">

                                            <div className="admin-control-group">

                                                <label>
                                                    Order Status
                                                </label>

                                                <select
                                                    value={
                                                        order.orderStatus
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                            order._id ||
                                                        order.orderStatus ===
                                                            "Cancelled"
                                                    }
                                                    onChange={
                                                        event =>
                                                            updateOrderStatus(
                                                                order._id,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                    }
                                                    className={`admin-status-select status-${order.orderStatus.toLowerCase()}`}
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="Confirmed">
                                                        Confirmed
                                                    </option>

                                                    <option value="Ready">
                                                        Ready
                                                    </option>

                                                    <option value="Completed">
                                                        Completed
                                                    </option>

                                                    <option value="Cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>

                                            </div>


                                            <div className="admin-control-group">

                                                <label>
                                                    Payment
                                                </label>

                                                <select
                                                    value={
                                                        order.paymentStatus
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        order._id
                                                    }
                                                    onChange={
                                                        event =>
                                                            updatePaymentStatus(
                                                                order._id,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                    }
                                                    className={`admin-payment-select payment-${order.paymentStatus.toLowerCase()}`}
                                                >
                                                    <option value="Unpaid">
                                                        Unpaid
                                                    </option>

                                                    <option value="Paid">
                                                        Paid
                                                    </option>

                                                    <option value="Failed">
                                                        Failed
                                                    </option>

                                                    <option value="Refunded">
                                                        Refunded
                                                    </option>
                                                </select>

                                            </div>


                                            <div className="admin-current-state">

                                                {order.orderStatus ===
                                                "Completed" ? (
                                                    <CheckCircle2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                ) : (
                                                    <Clock3
                                                        size={
                                                            17
                                                        }
                                                    />
                                                )}

                                                <div>
                                                    <span>
                                                        CURRENT
                                                    </span>

                                                    <strong>
                                                        {
                                                            order.orderStatus
                                                        }
                                                        {" • "}
                                                        {
                                                            order.paymentStatus
                                                        }
                                                    </strong>
                                                </div>

                                            </div>

                                        </div>


                                        {/* CANCELLATION */}

                                        {order.orderStatus ===
                                            "Cancelled" && (
                                            <div className="admin-cancellation-info">

                                                <XCircle
                                                    size={
                                                        15
                                                    }
                                                />

                                                <div>
                                                    <strong>
                                                        Cancelled
                                                        {order.cancelledBy &&
                                                            ` by ${order.cancelledBy}`}
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
                        )
                    )}

                </div>

            </div>
        </section>
    );
}