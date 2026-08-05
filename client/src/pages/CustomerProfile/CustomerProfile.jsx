import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Mail,
    Phone,
    ShoppingBag,
    UserRound,
    XCircle
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import {
    getCustomerProfile
} from "../../services/customerService";

import "./customerProfile.css";


export default function CustomerProfile() {
    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    const [
        customer,
        setCustomer
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);


    // =========================
    // LOAD
    // =========================

    useEffect(
        () => {

            const loadCustomer =
                async () => {
                    try {
                        setLoading(
                            true
                        );

                        const response =
                            await getCustomerProfile(
                                id
                            );

                        setCustomer(
                            response.data
                                .customer
                        );

                    } catch (error) {
                        console.error(
                            "Customer profile error:",
                            error
                        );

                        toast.error(
                            error.response
                                ?.data
                                ?.message ||
                            "Unable to load customer profile."
                        );

                    } finally {
                        setLoading(
                            false
                        );
                    }
                };

            loadCustomer();

        },
        [
            id
        ]
    );


    // =========================
    // FORMAT
    // =========================

    const formatMoney =
        value =>
            Number(
                value ||
                0
            ).toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits:
                        2
                }
            );


    const formatDate =
        value => {
            if (!value) {
                return "-";
            }

            return new Date(
                value
            ).toLocaleString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );
        };


    if (loading) {
        return (
            <section className="customer-profile-page">

                <div className="customer-profile-loading">

                    <div className="customer-profile-loader" />

                    Loading customer profile...

                </div>

            </section>
        );
    }


    if (!customer) {
        return (
            <section className="customer-profile-page">

                <div className="customer-profile-empty">
                    Customer not found.
                </div>

            </section>
        );
    }


    const stats =
        customer.stats ||
        {};


    return (
        <section className="customer-profile-page">

            <div className="customer-profile-container">

                {/* =========================
                    BACK
                ========================= */}

                <button
                    type="button"

                    className="customer-profile-back"

                    onClick={() =>
                        navigate(
                            "/admin/customers"
                        )
                    }
                >

                    <ArrowLeft
                        size={16}
                    />

                    Back to Customers

                </button>


                {/* =========================
                    PROFILE HEADER
                ========================= */}

                <motion.div
                    className="customer-profile-header"

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
                >

                    <div className="customer-profile-avatar">

                        {customer.avatar ? (

                            <img
                                src={
                                    customer.avatar
                                }

                                alt={
                                    customer.fullName ||
                                    "Customer"
                                }
                            />

                        ) : (

                            <UserRound
                                size={32}
                            />

                        )}

                    </div>


                    <div className="customer-profile-identity">

                        <span>
                            CUSTOMER PROFILE
                        </span>

                        <h1>
                            {customer.fullName ||
                                customer.username ||
                                "Customer"}
                        </h1>

                        {customer.username && (
                            <small>
                                @
                                {
                                    customer.username
                                }
                            </small>
                        )}

                    </div>


                    <span
                        className={
                            customer.isActive
                                ? "customer-profile-status active"
                                : "customer-profile-status inactive"
                        }
                    >
                        {customer.isActive
                            ? "Active Account"
                            : "Inactive Account"}
                    </span>

                </motion.div>


                {/* =========================
                    CONTACT INFO
                ========================= */}

                <div className="customer-profile-info">

                    <div>

                        <Mail
                            size={17}
                        />

                        <span>
                            Email
                        </span>

                        <strong>
                            {customer.email ||
                                "Not provided"}
                        </strong>

                    </div>


                    <div>

                        <Phone
                            size={17}
                        />

                        <span>
                            Phone
                        </span>

                        <strong>
                            {customer.phone ||
                                "Not provided"}
                        </strong>

                    </div>


                    <div>

                        <CalendarDays
                            size={17}
                        />

                        <span>
                            Customer Since
                        </span>

                        <strong>
                            {
                                formatDate(
                                    customer.createdAt
                                )
                            }
                        </strong>

                    </div>

                </div>


                {/* =========================
                    STATS
                ========================= */}

                <div className="customer-profile-stats">

                    <div>

                        <ShoppingBag
                            size={20}
                        />

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {
                                stats.totalOrders ||
                                0
                            }
                        </strong>

                    </div>


                    <div>

                        <IndianRupee
                            size={20}
                        />

                        <span>
                            Total Spent
                        </span>

                        <strong>
                            ₹
                            {
                                formatMoney(
                                    stats.totalSpent
                                )
                            }
                        </strong>

                    </div>


                    <div>

                        <Clock3
                            size={20}
                        />

                        <span>
                            Active Orders
                        </span>

                        <strong>
                            {
                                stats.pendingOrders ||
                                0
                            }
                        </strong>

                    </div>


                    <div>

                        <CheckCircle2
                            size={20}
                        />

                        <span>
                            Completed
                        </span>

                        <strong>
                            {
                                stats.completedOrders ||
                                0
                            }
                        </strong>

                    </div>


                    <div>

                        <XCircle
                            size={20}
                        />

                        <span>
                            Cancelled
                        </span>

                        <strong>
                            {
                                stats.cancelledOrders ||
                                0
                            }
                        </strong>

                    </div>


                    <div>

                        <IndianRupee
                            size={20}
                        />

                        <span>
                            Unpaid Amount
                        </span>

                        <strong>
                            ₹
                            {
                                formatMoney(
                                    stats.unpaidAmount
                                )
                            }
                        </strong>

                    </div>

                </div>


                {/* =========================
                    ORDER HISTORY
                ========================= */}

                <div className="customer-profile-orders-heading">

                    <span>
                        PURCHASE HISTORY
                    </span>

                    <h2>
                        Order History
                    </h2>

                    <p>
                        Complete order history
                        for this customer.
                    </p>

                </div>


                {!customer.orders ||
                customer.orders.length ===
                    0 ? (

                    <div className="customer-profile-no-orders">

                        <ShoppingBag
                            size={30}
                        />

                        <h3>
                            No orders yet.
                        </h3>

                        <p>
                            This customer has not
                            placed any orders.
                        </p>

                    </div>

                ) : (

                    <div className="customer-profile-orders">

                        {customer.orders.map(
                            (
                                order,
                                index
                            ) => (

                                <motion.article
                                    key={
                                        order._id
                                    }

                                    className="customer-profile-order-card"

                                    initial={{
                                        opacity:
                                            0,

                                        y:
                                            16
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
                                            0.025
                                    }}
                                >

                                    <div className="customer-profile-order-top">

                                        <div>

                                            <span>
                                                ORDER
                                            </span>

                                            <h3>
                                                {
                                                    order.orderNumber
                                                }
                                            </h3>

                                            <small>
                                                {
                                                    formatDate(
                                                        order.placedAt ||
                                                        order.createdAt
                                                    )
                                                }
                                            </small>

                                        </div>


                                        <div className="customer-profile-order-amount">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    formatMoney(
                                                        order.totalAmount
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="customer-profile-order-badges">

                                        <span
                                            className={`customer-order-status ${order.orderStatus?.toLowerCase()}`}
                                        >
                                            {
                                                order.orderStatus
                                            }
                                        </span>


                                        <span
                                            className={`customer-payment-status ${order.paymentStatus?.toLowerCase()}`}
                                        >
                                            {
                                                order.paymentStatus
                                            }
                                        </span>

                                    </div>


                                    <div className="customer-profile-order-items">

                                        {order.items?.map(
                                            (
                                                item,
                                                itemIndex
                                            ) => (

                                                <div
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
                                                            }
                                                            {" × ₹"}
                                                            {
                                                                formatMoney(
                                                                    item.price
                                                                )
                                                            }
                                                        </span>

                                                    </div>


                                                    <strong>
                                                        ₹
                                                        {
                                                            formatMoney(
                                                                item.subtotal
                                                            )
                                                        }
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {order.orderStatus ===
                                        "Cancelled" &&
                                        order.cancellationReason && (

                                        <div className="customer-profile-cancelled">

                                            <XCircle
                                                size={15}
                                            />

                                            <div>

                                                <strong>
                                                    Cancelled
                                                    {order.cancelledBy &&
                                                        ` by ${order.cancelledBy}`}
                                                </strong>

                                                <span>
                                                    {
                                                        order.cancellationReason
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    )}

                                </motion.article>

                            )
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}