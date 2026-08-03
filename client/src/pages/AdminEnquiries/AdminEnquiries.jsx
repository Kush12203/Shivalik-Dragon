import {
    CheckCircle2,
    Clock3,
    Eye,
    Mail,
    MessageSquareText,
    Phone,
    RefreshCcw,
    Search,
    Trash2,
    Undo2
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    deleteEnquiry,
    getEnquiries,
    updateEnquiryReadStatus,
    updateEnquiryResolvedStatus
} from "../../services/contactService";

import "./adminEnquiries.css";

export default function AdminEnquiries() {
    const [
        enquiries,
        setEnquiries
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
        status,
        setStatus
    ] = useState("all");

    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);

    const [
        unresolvedCount,
        setUnresolvedCount
    ] = useState(0);

    const [
        selectedEnquiry,
        setSelectedEnquiry
    ] = useState(null);

    const [
        deletingId,
        setDeletingId
    ] = useState(null);


    const fetchEnquiries =
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

                const params = {};

                if (
                    search.trim()
                ) {
                    params.search =
                        search.trim();
                }

                if (
                    status !==
                    "all"
                ) {
                    params.status =
                        status;
                }

                const response =
                    await getEnquiries(
                        params
                    );

                setEnquiries(
                    response.data
                        .messages ||
                        []
                );

                setUnreadCount(
                    response.data
                        .unreadCount ||
                        0
                );

                setUnresolvedCount(
                    response.data
                        .unresolvedCount ||
                        0
                );

            } catch (error) {
                console.error(
                    "Fetch enquiries error:",
                    error
                );

                toast.error(
                    error.response
                        ?.data
                        ?.message ||
                        "Unable to load enquiries."
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
            const delay =
                setTimeout(
                    () => {
                        fetchEnquiries();
                    },
                    250
                );

            return () =>
                clearTimeout(
                    delay
                );
        },
        [
            search,
            status
        ]
    );


    const totalCount =
        enquiries.length;


    const resolvedCount =
        useMemo(
            () =>
                enquiries.filter(
                    item =>
                        item.isResolved
                ).length,
            [
                enquiries
            ]
        );


    const formatDate = (
        value
    ) => {
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


    const handleOpen =
        async (
            enquiry
        ) => {
            setSelectedEnquiry(
                enquiry
            );

            if (
                !enquiry.isRead
            ) {
                try {
                    const response =
                        await updateEnquiryReadStatus(
                            enquiry._id,
                            true
                        );

                    const updated =
                        response.data
                            .contactMessage;

                    setEnquiries(
                        current =>
                            current.map(
                                item =>
                                    item._id ===
                                    updated._id
                                        ? updated
                                        : item
                            )
                    );

                    setSelectedEnquiry(
                        updated
                    );

                    setUnreadCount(
                        current =>
                            Math.max(
                                0,
                                current -
                                    1
                            )
                    );
                } catch (error) {
                    console.error(
                        "Mark read error:",
                        error
                    );
                }
            }
        };


    const handleResolve =
        async (
            enquiry
        ) => {
            try {
                const response =
                    await updateEnquiryResolvedStatus(
                        enquiry._id,
                        !enquiry.isResolved
                    );

                const updated =
                    response.data
                        .contactMessage;

                setEnquiries(
                    current =>
                        current.map(
                            item =>
                                item._id ===
                                updated._id
                                    ? updated
                                    : item
                        )
                );

                if (
                    selectedEnquiry
                        ?._id ===
                    updated._id
                ) {
                    setSelectedEnquiry(
                        updated
                    );
                }

                fetchEnquiries(
                    true
                );

                toast.success(
                    updated.isResolved
                        ? "Enquiry resolved."
                        : "Enquiry reopened."
                );

            } catch (error) {
                toast.error(
                    error.response
                        ?.data
                        ?.message ||
                        "Unable to update enquiry."
                );
            }
        };


    const handleDelete =
        async (
            enquiry
        ) => {
            const confirmed =
                window.confirm(
                    `Delete enquiry from ${enquiry.fullName}?`
                );

            if (
                !confirmed
            ) {
                return;
            }

            try {
                setDeletingId(
                    enquiry._id
                );

                await deleteEnquiry(
                    enquiry._id
                );

                setEnquiries(
                    current =>
                        current.filter(
                            item =>
                                item._id !==
                                enquiry._id
                        )
                );

                if (
                    selectedEnquiry
                        ?._id ===
                    enquiry._id
                ) {
                    setSelectedEnquiry(
                        null
                    );
                }

                fetchEnquiries(
                    true
                );

                toast.success(
                    "Enquiry deleted."
                );

            } catch (error) {
                toast.error(
                    error.response
                        ?.data
                        ?.message ||
                        "Unable to delete enquiry."
                );
            } finally {
                setDeletingId(
                    null
                );
            }
        };


    if (loading) {
        return (
            <section className="admin-enquiries-page">
                <div className="admin-enquiries-loading">
                    <div className="admin-enquiries-loader" />

                    <p>
                        Loading enquiries...
                    </p>
                </div>
            </section>
        );
    }


    return (
        <section className="admin-enquiries-page">

            <div className="admin-enquiries-container">

                <div className="admin-enquiries-header">

                    <div>
                        <span>
                            CUSTOMER SUPPORT
                        </span>

                        <h1>
                            Contact
                            <strong>
                                {" "}
                                Enquiries
                            </strong>
                        </h1>

                        <p>
                            View and manage
                            messages submitted
                            through the website
                            contact form.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-enquiries-refresh"
                        onClick={() =>
                            fetchEnquiries(
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
                                    ? "admin-enquiries-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>


                <div className="admin-enquiries-summary">

                    <div className="admin-enquiry-summary-card">
                        <div className="admin-enquiry-summary-icon green">
                            <MessageSquareText
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Results
                            </span>

                            <strong>
                                {totalCount}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-enquiry-summary-card">
                        <div className="admin-enquiry-summary-icon blue">
                            <Mail
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Unread
                            </span>

                            <strong>
                                {unreadCount}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-enquiry-summary-card">
                        <div className="admin-enquiry-summary-icon orange">
                            <Clock3
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {unresolvedCount}
                            </strong>
                        </div>
                    </div>


                    <div className="admin-enquiry-summary-card">
                        <div className="admin-enquiry-summary-icon pink">
                            <CheckCircle2
                                size={21}
                            />
                        </div>

                        <div>
                            <span>
                                Resolved
                            </span>

                            <strong>
                                {resolvedCount}
                            </strong>
                        </div>
                    </div>

                </div>


                <div className="admin-enquiries-toolbar">

                    <div className="admin-enquiries-search">
                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            value={
                                search
                            }
                            placeholder="Search name, email, phone, reason or message..."
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
                            status
                        }
                        onChange={
                            event =>
                                setStatus(
                                    event
                                        .target
                                        .value
                                )
                        }
                    >
                        <option value="all">
                            All enquiries
                        </option>

                        <option value="unread">
                            Unread
                        </option>

                        <option value="read">
                            Read
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="resolved">
                            Resolved
                        </option>
                    </select>

                </div>


                {enquiries.length ===
                0 ? (
                    <div className="admin-enquiries-empty">
                        <MessageSquareText
                            size={34}
                        />

                        <h3>
                            No enquiries found
                        </h3>

                        <p>
                            New customer messages
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-enquiries-list">

                        {enquiries.map(
                            enquiry => (
                                <article
                                    key={
                                        enquiry._id
                                    }
                                    className={`admin-enquiry-card ${
                                        !enquiry.isRead
                                            ? "unread"
                                            : ""
                                    }`}
                                >

                                    <div className="admin-enquiry-card-top">

                                        <div>
                                            <div className="admin-enquiry-name-row">
                                                <h2>
                                                    {
                                                        enquiry.fullName
                                                    }
                                                </h2>

                                                {!enquiry.isRead && (
                                                    <span className="admin-enquiry-new">
                                                        NEW
                                                    </span>
                                                )}

                                                {enquiry.isResolved && (
                                                    <span className="admin-enquiry-resolved">
                                                        RESOLVED
                                                    </span>
                                                )}
                                            </div>

                                            <span className="admin-enquiry-reason">
                                                {
                                                    enquiry.reason
                                                }
                                            </span>
                                        </div>

                                        <span className="admin-enquiry-date">
                                            {formatDate(
                                                enquiry.createdAt
                                            )}
                                        </span>

                                    </div>


                                    <p className="admin-enquiry-preview">
                                        {
                                            enquiry.message
                                        }
                                    </p>


                                    <div className="admin-enquiry-contact-row">

                                        <a
                                            href={`mailto:${enquiry.email}`}
                                        >
                                            <Mail
                                                size={16}
                                            />

                                            {
                                                enquiry.email
                                            }
                                        </a>

                                        {enquiry.phone && (
                                            <a
                                                href={`tel:${enquiry.phone}`}
                                            >
                                                <Phone
                                                    size={16}
                                                />

                                                {
                                                    enquiry.phone
                                                }
                                            </a>
                                        )}

                                    </div>


                                    <div className="admin-enquiry-actions">

                                        <button
                                            type="button"
                                            className="admin-enquiry-view"
                                            onClick={() =>
                                                handleOpen(
                                                    enquiry
                                                )
                                            }
                                        >
                                            <Eye
                                                size={16}
                                            />

                                            View
                                        </button>


                                        <button
                                            type="button"
                                            className={
                                                enquiry.isResolved
                                                    ? "admin-enquiry-reopen"
                                                    : "admin-enquiry-resolve"
                                            }
                                            onClick={() =>
                                                handleResolve(
                                                    enquiry
                                                )
                                            }
                                        >
                                            {enquiry.isResolved ? (
                                                <Undo2
                                                    size={16}
                                                />
                                            ) : (
                                                <CheckCircle2
                                                    size={16}
                                                />
                                            )}

                                            {enquiry.isResolved
                                                ? "Reopen"
                                                : "Resolve"}
                                        </button>


                                        <button
                                            type="button"
                                            className="admin-enquiry-delete"
                                            disabled={
                                                deletingId ===
                                                enquiry._id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    enquiry
                                                )
                                            }
                                        >
                                            <Trash2
                                                size={16}
                                            />

                                            Delete
                                        </button>

                                    </div>

                                </article>
                            )
                        )}

                    </div>
                )}

            </div>


            {selectedEnquiry && (
                <div
                    className="admin-enquiry-modal-overlay"
                    onClick={() =>
                        setSelectedEnquiry(
                            null
                        )
                    }
                >
                    <div
                        className="admin-enquiry-modal"
                        onClick={
                            event =>
                                event.stopPropagation()
                        }
                    >
                        <div className="admin-enquiry-modal-header">

                            <div>
                                <span>
                                    CUSTOMER ENQUIRY
                                </span>

                                <h2>
                                    {
                                        selectedEnquiry.fullName
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedEnquiry(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="admin-enquiry-modal-info">

                            <div>
                                <span>
                                    Reason
                                </span>

                                <strong>
                                    {
                                        selectedEnquiry.reason
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Received
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedEnquiry.createdAt
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div className="admin-enquiry-modal-contact">

                            <a
                                href={`mailto:${selectedEnquiry.email}`}
                            >
                                <Mail
                                    size={17}
                                />

                                {
                                    selectedEnquiry.email
                                }
                            </a>

                            {selectedEnquiry.phone && (
                                <a
                                    href={`tel:${selectedEnquiry.phone}`}
                                >
                                    <Phone
                                        size={17}
                                    />

                                    {
                                        selectedEnquiry.phone
                                    }
                                </a>
                            )}

                        </div>


                        <div className="admin-enquiry-message-box">
                            <span>
                                MESSAGE
                            </span>

                            <p>
                                {
                                    selectedEnquiry.message
                                }
                            </p>
                        </div>


                        <div className="admin-enquiry-modal-actions">

                            <button
                                type="button"
                                className={
                                    selectedEnquiry.isResolved
                                        ? "admin-enquiry-reopen"
                                        : "admin-enquiry-resolve"
                                }
                                onClick={() =>
                                    handleResolve(
                                        selectedEnquiry
                                    )
                                }
                            >
                                {selectedEnquiry.isResolved ? (
                                    <>
                                        <Undo2
                                            size={16}
                                        />

                                        Reopen enquiry
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={16}
                                        />

                                        Mark resolved
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="admin-enquiry-delete"
                                onClick={() =>
                                    handleDelete(
                                        selectedEnquiry
                                    )
                                }
                            >
                                <Trash2
                                    size={16}
                                />

                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </section>
    );
}