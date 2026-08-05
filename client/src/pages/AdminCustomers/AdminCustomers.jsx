import {
    ArrowRight,
    CalendarDays,
    IndianRupee,
    Mail,
    Phone,
    RefreshCcw,
    Search,
    ShoppingBag,
    UserRound,
    UsersRound
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    motion
} from "framer-motion";

import {
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    getCustomers
} from "../../services/customerService";

import "./adminCustomers.css";


export default function AdminCustomers() {
    const navigate =
        useNavigate();

    const [
        customers,
        setCustomers
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
        statusFilter,
        setStatusFilter
    ] = useState("all");


    // =========================
    // LOAD CUSTOMERS
    // =========================

    const loadCustomers =
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
                    await getCustomers();

                setCustomers(
                    response.data
                        .customers ||
                    []
                );

            } catch (error) {
                console.error(
                    "Customers error:",
                    error
                );

                toast.error(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load customers."
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
            loadCustomers();
        },
        []
    );


    // =========================
    // FILTER
    // =========================

    const filteredCustomers =
        useMemo(
            () => {
                const term =
                    search
                        .trim()
                        .toLowerCase();

                return customers.filter(
                    customer => {

                        const matchesSearch =
                            !term ||
                            customer.fullName
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            customer.username
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
                                "all" ||
                            (
                                statusFilter ===
                                    "active" &&
                                customer.isActive
                            ) ||
                            (
                                statusFilter ===
                                    "inactive" &&
                                !customer.isActive
                            );

                        return (
                            matchesSearch &&
                            matchesStatus
                        );
                    }
                );
            },
            [
                customers,
                search,
                statusFilter
            ]
        );


    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(
            () => {

                const totalSpent =
                    customers.reduce(
                        (
                            total,
                            customer
                        ) =>
                            total +
                            Number(
                                customer.totalSpent ||
                                0
                            ),
                        0
                    );

                const totalOrders =
                    customers.reduce(
                        (
                            total,
                            customer
                        ) =>
                            total +
                            Number(
                                customer.totalOrders ||
                                0
                            ),
                        0
                    );

                return {
                    total:
                        customers.length,

                    active:
                        customers.filter(
                            customer =>
                                customer.isActive
                        ).length,

                    orders:
                        totalOrders,

                    spent:
                        totalSpent
                };
            },
            [
                customers
            ]
        );


    // =========================
    // FORMAT
    // =========================

    const formatMoney =
        value => {
            return Number(
                value ||
                0
            ).toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits:
                        2
                }
            );
        };


    const formatDate =
        value => {
            if (!value) {
                return "-";
            }

            return new Date(
                value
            ).toLocaleDateString(
                "en-IN",
                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            );
        };


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <section className="customers-admin-page">

                <div className="customers-admin-loading">

                    <div className="customers-admin-loader" />

                    <span>
                        Loading customers...
                    </span>

                </div>

            </section>
        );
    }


    return (
        <section className="customers-admin-page">

            <div className="customers-admin-container">

                {/* =========================
                    HEADER
                ========================= */}

                <motion.div
                    className="customers-admin-header"

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
                >

                    <div>

                        <span>
                            CUSTOMER MANAGEMENT
                        </span>

                        <h1>
                            Customer
                            <strong>
                                {" "}
                                profiles.
                            </strong>
                        </h1>

                        <p>
                            View registered customers,
                            their account information,
                            order activity and complete
                            purchase history.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="customers-admin-refresh"

                        disabled={
                            refreshing
                        }

                        onClick={() =>
                            loadCustomers(
                                true
                            )
                        }
                    >

                        <RefreshCcw
                            size={16}

                            className={
                                refreshing
                                    ? "customers-admin-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

                </motion.div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <div className="customers-admin-summary">

                    <div className="customers-admin-summary-card">

                        <div className="customers-admin-summary-icon green">
                            <UsersRound
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Total Customers
                            </span>

                            <strong>
                                {
                                    summary.total
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="customers-admin-summary-card">

                        <div className="customers-admin-summary-icon blue">
                            <UserRound
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Active Accounts
                            </span>

                            <strong>
                                {
                                    summary.active
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="customers-admin-summary-card">

                        <div className="customers-admin-summary-icon orange">
                            <ShoppingBag
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {
                                    summary.orders
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="customers-admin-summary-card">

                        <div className="customers-admin-summary-icon purple">
                            <IndianRupee
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Customer Spend
                            </span>

                            <strong>
                                ₹
                                {
                                    formatMoney(
                                        summary.spent
                                    )
                                }
                            </strong>
                        </div>

                    </div>

                </div>


                {/* =========================
                    FILTERS
                ========================= */}

                <div className="customers-admin-filters">

                    <div className="customers-admin-search">

                        <Search
                            size={17}
                        />

                        <input
                            type="text"

                            placeholder="Search name, email, username or phone..."

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

                        <option value="all">
                            All Accounts
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>

                </div>


                <div className="customers-admin-results">

                    Showing{" "}

                    <strong>
                        {
                            filteredCustomers
                                .length
                        }
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {
                            customers.length
                        }
                    </strong>

                    {" "}customers

                </div>


                {/* =========================
                    CUSTOMERS
                ========================= */}

                {filteredCustomers.length ===
                0 ? (

                    <div className="customers-admin-empty">

                        <UsersRound
                            size={35}
                        />

                        <h3>
                            No customers found.
                        </h3>

                        <p>
                            Try changing your
                            search or filter.
                        </p>

                    </div>

                ) : (

                    <div className="customers-admin-grid">

                        {filteredCustomers.map(
                            (
                                customer,
                                index
                            ) => (

                                <motion.article
                                    key={
                                        customer._id
                                    }

                                    className="customers-admin-card"

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
                                            0.025
                                    }}
                                >

                                    {/* =========================
                                        PROFILE TOP
                                    ========================= */}

                                    <div className="customers-admin-profile">

                                        <div className="customers-admin-avatar">

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
                                                    size={23}
                                                />

                                            )}

                                        </div>


                                        <div className="customers-admin-profile-copy">

                                            <div className="customers-admin-name-line">

                                                <h2>
                                                    {customer.fullName ||
                                                        customer.username ||
                                                        "Customer"}
                                                </h2>


                                                <span
                                                    className={
                                                        customer.isActive
                                                            ? "customer-status active"
                                                            : "customer-status inactive"
                                                    }
                                                >
                                                    {customer.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </div>


                                            {customer.username && (

                                                <span className="customers-admin-username">
                                                    @
                                                    {
                                                        customer.username
                                                    }
                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    {/* =========================
                                        CONTACT
                                    ========================= */}

                                    <div className="customers-admin-contact">

                                        <div>
                                            <Mail
                                                size={15}
                                            />

                                            <span>
                                                {customer.email ||
                                                    "No email"}
                                            </span>
                                        </div>


                                        <div>
                                            <Phone
                                                size={15}
                                            />

                                            <span>
                                                {customer.phone ||
                                                    "No phone"}
                                            </span>
                                        </div>


                                        <div>
                                            <CalendarDays
                                                size={15}
                                            />

                                            <span>
                                                Joined{" "}
                                                {
                                                    formatDate(
                                                        customer.createdAt
                                                    )
                                                }
                                            </span>
                                        </div>

                                    </div>


                                    {/* =========================
                                        STATS
                                    ========================= */}

                                    <div className="customers-admin-card-stats">

                                        <div>
                                            <span>
                                                Orders
                                            </span>

                                            <strong>
                                                {
                                                    customer.totalOrders ||
                                                    0
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Spent
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    formatMoney(
                                                        customer.totalSpent
                                                    )
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Pending
                                            </span>

                                            <strong>
                                                {
                                                    customer.pendingOrders ||
                                                    0
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    {/* =========================
                                        VIEW PROFILE
                                    ========================= */}

                                    <button
                                        type="button"

                                        className="customers-admin-view"

                                        onClick={() =>
                                            navigate(
                                                `/admin/customers/${customer._id}`
                                            )
                                        }
                                    >

                                        View Customer Profile

                                        <ArrowRight
                                            size={17}
                                        />

                                    </button>

                                </motion.article>

                            )
                        )}

                    </div>
                )}

            </div>

        </section>
    );
}