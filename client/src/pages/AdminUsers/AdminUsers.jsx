import {
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Plus,
    RefreshCcw,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    UsersRound,
    X,
    XCircle
} from "lucide-react";

import {
    AnimatePresence,
    motion
} from "framer-motion";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import toast from "react-hot-toast";

import api from "../../services/api";

import {
    useAuth
} from "../../context/AuthContext";

import "./adminUsers.css";

const emptyAdminForm = {
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "admin"
};

export default function AdminUsers() {
    const {
        user: loggedInUser
    } = useAuth();

    const [
        users,
        setUsers
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
        roleFilter,
        setRoleFilter
    ] = useState("all");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("all");

    const [
        updatingId,
        setUpdatingId
    ] = useState(null);

    const [
        createModal,
        setCreateModal
    ] = useState(false);

    const [
        adminForm,
        setAdminForm
    ] = useState(
        emptyAdminForm
    );

    const [
        creatingAdmin,
        setCreatingAdmin
    ] = useState(false);

    const [
        showAdminPassword,
        setShowAdminPassword
    ] = useState(false);

    const [
        resetUser,
        setResetUser
    ] = useState(null);

    const [
        resetPassword,
        setResetPassword
    ] = useState("");

    const [
        showResetPassword,
        setShowResetPassword
    ] = useState(false);

    const [
        resettingPassword,
        setResettingPassword
    ] = useState(false);

    const [
        deleteUser,
        setDeleteUser
    ] = useState(null);

    const [
        deletingId,
        setDeletingId
    ] = useState(null);

    const isSuperAdmin =
        loggedInUser?.role ===
        "superadmin";

    // =========================
    // LOAD USERS
    // =========================

    const loadUsers =
        async (
            refresh = false
        ) => {
            try {
                if (refresh) {
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
                        "/users"
                    );

                setUsers(
                    response.data.users ||
                        []
                );
            } catch (error) {
                console.error(
                    "Load users error:",
                    error
                );

                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load users."
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
        loadUsers();
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
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
        };

    // =========================
    // FILTER
    // =========================

    const filteredUsers =
        useMemo(
            () => {
                const term =
                    search
                        .trim()
                        .toLowerCase();

                return users.filter(
                    user => {
                        const matchesSearch =
                            !term ||
                            user.fullName
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            user.username
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            user.email
                                ?.toLowerCase()
                                .includes(
                                    term
                                ) ||
                            user.phone
                                ?.toLowerCase()
                                .includes(
                                    term
                                );

                        const matchesRole =
                            roleFilter ===
                                "all" ||
                            user.role ===
                                roleFilter;

                        const matchesStatus =
                            statusFilter ===
                                "all" ||
                            (statusFilter ===
                                "active"
                                ? user.isActive
                                : !user.isActive);

                        return (
                            matchesSearch &&
                            matchesRole &&
                            matchesStatus
                        );
                    }
                );
            },
            [
                users,
                search,
                roleFilter,
                statusFilter
            ]
        );

    // =========================
    // SUMMARY
    // =========================

    const summary =
        useMemo(
            () => ({
                total:
                    users.length,

                customers:
                    users.filter(
                        user =>
                            user.role ===
                            "customer"
                    ).length,

                admins:
                    users.filter(
                        user =>
                            user.role ===
                            "admin"
                    ).length,

                superadmins:
                    users.filter(
                        user =>
                            user.role ===
                            "superadmin"
                    ).length
            }),
            [users]
        );

    // =========================
    // UPDATE ROLE
    // =========================

    const updateRole =
        async (
            userId,
            role
        ) => {
            try {
                setUpdatingId(
                    userId
                );

                const response =
                    await api.put(
                        `/users/${userId}`,
                        {
                            role
                        }
                    );

                setUsers(
                    current =>
                        current.map(
                            item =>
                                item._id ===
                                userId
                                    ? {
                                          ...item,
                                          ...response
                                              .data
                                              .user
                                      }
                                    : item
                        )
                );

                toast.success(
                    "User role updated."
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update user role."
                );
            } finally {
                setUpdatingId(
                    null
                );
            }
        };

    // =========================
    // TOGGLE ACTIVE
    // =========================

    const toggleActive =
        async user => {
            try {
                setUpdatingId(
                    user._id
                );

                const response =
                    await api.put(
                        `/users/${user._id}`,
                        {
                            isActive:
                                !user.isActive
                        }
                    );

                setUsers(
                    current =>
                        current.map(
                            item =>
                                item._id ===
                                user._id
                                    ? {
                                          ...item,
                                          ...response
                                              .data
                                              .user
                                      }
                                    : item
                        )
                );

                toast.success(
                    response.data.user
                        .isActive
                        ? "User activated."
                        : "User deactivated."
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update account status."
                );
            } finally {
                setUpdatingId(
                    null
                );
            }
        };

    // =========================
    // CREATE ADMIN INPUT
    // =========================

    const handleAdminChange =
        event => {
            const {
                name,
                value
            } = event.target;

            setAdminForm(
                current => ({
                    ...current,

                    [name]:
                        value
                })
            );
        };

    // =========================
    // CREATE ADMIN
    // =========================

    const handleCreateAdmin =
        async event => {
            event.preventDefault();

            if (
                !adminForm.fullName.trim() ||
                !adminForm.username.trim() ||
                !adminForm.email.trim() ||
                !adminForm.password
            ) {
                toast.error(
                    "Complete all required fields."
                );

                return;
            }

            if (
                adminForm.password.length <
                8
            ) {
                toast.error(
                    "Password must contain at least 8 characters."
                );

                return;
            }

            try {
                setCreatingAdmin(
                    true
                );

                await api.post(
                    "/users/admins",
                    {
                        fullName:
                            adminForm.fullName
                                .trim(),

                        username:
                            adminForm.username
                                .trim(),

                        email:
                            adminForm.email
                                .trim(),

                        phone:
                            adminForm.phone
                                .trim(),

                        password:
                            adminForm.password,

                        role:
                            adminForm.role
                    }
                );

                toast.success(
                    "Administrator created successfully."
                );

                setAdminForm(
                    emptyAdminForm
                );

                setCreateModal(
                    false
                );

                await loadUsers(
                    true
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to create administrator."
                );
            } finally {
                setCreatingAdmin(
                    false
                );
            }
        };

    // =========================
    // RESET PASSWORD
    // =========================

    const handleResetPassword =
        async () => {
            if (!resetUser) {
                return;
            }

            if (
                resetPassword.length <
                8
            ) {
                toast.error(
                    "Password must contain at least 8 characters."
                );

                return;
            }

            try {
                setResettingPassword(
                    true
                );

                await api.put(
                    `/users/${resetUser._id}/password`,
                    {
                        password:
                            resetPassword
                    }
                );

                toast.success(
                    "Password reset successfully."
                );

                setResetUser(
                    null
                );

                setResetPassword(
                    ""
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to reset password."
                );
            } finally {
                setResettingPassword(
                    false
                );
            }
        };

    // =========================
    // DELETE
    // =========================

    const handleDelete =
        async () => {
            if (!deleteUser) {
                return;
            }

            try {
                setDeletingId(
                    deleteUser._id
                );

                await api.delete(
                    `/users/${deleteUser._id}`
                );

                setUsers(
                    current =>
                        current.filter(
                            item =>
                                item._id !==
                                deleteUser._id
                        )
                );

                toast.success(
                    "User deleted successfully."
                );

                setDeleteUser(
                    null
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to delete user."
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
            <section className="admin-users-page">
                <div className="admin-users-loading">

                    <div className="admin-users-loader" />

                    <span>
                        Loading users...
                    </span>

                </div>
            </section>
        );
    }

    return (
        <section className="admin-users-page">

            <div className="admin-users-container">

                {/* HEADER */}

                <motion.div
                    className="admin-users-header"

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
                            USER MANAGEMENT
                        </span>

                        <h1>
                            Manage
                            <strong>
                                {" "}
                                users.
                            </strong>
                        </h1>

                        <p>
                            Review customers and
                            administrators and
                            manage account access.
                        </p>
                    </div>


                    <div className="admin-users-header-actions">

                        <button
                            className="admin-users-refresh"

                            disabled={
                                refreshing
                            }

                            onClick={() =>
                                loadUsers(
                                    true
                                )
                            }
                        >
                            <RefreshCcw
                                size={15}
                                className={
                                    refreshing
                                        ? "admin-users-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>


                        {isSuperAdmin && (

                            <button
                                className="admin-users-add"

                                onClick={() =>
                                    setCreateModal(
                                        true
                                    )
                                }
                            >
                                <Plus
                                    size={16}
                                />

                                Add Admin
                            </button>

                        )}

                    </div>

                </motion.div>


                {/* PERMISSION NOTE */}

                {!isSuperAdmin && (

                    <div className="admin-users-permission-note">

                        <ShieldCheck
                            size={18}
                        />

                        <div>
                            <strong>
                                View-only administration
                            </strong>

                            <span>
                                Only a superadmin can
                                change roles, deactivate
                                accounts, reset passwords
                                or create administrators.
                            </span>
                        </div>

                    </div>

                )}


                {/* SUMMARY */}

                <div className="admin-users-summary">

                    <div className="admin-user-summary-card">

                        <div className="admin-user-summary-icon green">
                            <UsersRound
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Total Users
                            </span>

                            <strong>
                                {
                                    summary.total
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="admin-user-summary-card">

                        <div className="admin-user-summary-icon blue">
                            <UserRound
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Customers
                            </span>

                            <strong>
                                {
                                    summary.customers
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="admin-user-summary-card">

                        <div className="admin-user-summary-icon gold">
                            <ShieldCheck
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Admins
                            </span>

                            <strong>
                                {
                                    summary.admins
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="admin-user-summary-card">

                        <div className="admin-user-summary-icon pink">
                            <CheckCircle2
                                size={20}
                            />
                        </div>

                        <div>
                            <span>
                                Super Admins
                            </span>

                            <strong>
                                {
                                    summary.superadmins
                                }
                            </strong>
                        </div>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="admin-users-filters">

                    <div className="admin-users-search">

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

                            placeholder="Search name, email, username or phone..."
                        />

                    </div>


                    <select
                        value={
                            roleFilter
                        }

                        onChange={
                            event =>
                                setRoleFilter(
                                    event.target.value
                                )
                        }
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="customer">
                            Customers
                        </option>

                        <option value="admin">
                            Admins
                        </option>

                        <option value="superadmin">
                            Super Admins
                        </option>
                    </select>


                    <select
                        value={
                            statusFilter
                        }

                        onChange={
                            event =>
                                setStatusFilter(
                                    event.target.value
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


                <div className="admin-users-result-count">

                    Showing{" "}
                    <strong>
                        {
                            filteredUsers.length
                        }
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {
                            users.length
                        }
                    </strong>{" "}
                    users

                </div>


                {/* USERS */}

                <div className="admin-users-list">

                    {filteredUsers.map(
                        (
                            user,
                            index
                        ) => {

                            const isSelf =
                                loggedInUser?._id ===
                                user._id;

                            return (

                                <motion.article
                                    className="admin-user-card"

                                    key={
                                        user._id
                                    }

                                    initial={{
                                        opacity: 0,
                                        y: 15
                                    }}

                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}

                                    transition={{
                                        delay:
                                            index *
                                            0.025
                                    }}
                                >

                                    {/* USER INFO */}

                                    <div className="admin-user-main">

                                        <div className="admin-user-avatar">

                                            {user.avatar ? (

                                                <img
                                                    src={
                                                        user.avatar
                                                    }

                                                    alt={
                                                        user.fullName
                                                    }
                                                />

                                            ) : (

                                                <UserRound
                                                    size={20}
                                                />

                                            )}

                                        </div>


                                        <div className="admin-user-info">

                                            <div className="admin-user-name-row">

                                                <strong>
                                                    {user.fullName ||
                                                        user.username ||
                                                        "User"}
                                                </strong>

                                                {isSelf && (
                                                    <span className="admin-user-you">
                                                        You
                                                    </span>
                                                )}

                                            </div>

                                            <span>
                                                {user.email ||
                                                    "No email"}
                                            </span>

                                            <small>
                                                @{user.username ||
                                                    "no-username"}

                                                {user.phone
                                                    ? ` • ${user.phone}`
                                                    : ""}
                                            </small>

                                        </div>

                                    </div>


                                    {/* META */}

                                    <div className="admin-user-meta">

                                        <div>

                                            <span>
                                                LOGIN
                                            </span>

                                            <strong>
                                                {user.authProvider ===
                                                "google"
                                                    ? "Google"
                                                    : "Email / Password"}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                JOINED
                                            </span>

                                            <strong>
                                                {
                                                    formatDate(
                                                        user.createdAt
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ROLE */}

                                    <div className="admin-user-role">

                                        <label>
                                            Role
                                        </label>

                                        {isSuperAdmin ? (

                                            <select
                                                value={
                                                    user.role
                                                }

                                                disabled={
                                                    updatingId ===
                                                        user._id ||
                                                    isSelf
                                                }

                                                onChange={
                                                    event =>
                                                        updateRole(
                                                            user._id,
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                }

                                                className={`user-role-select role-${user.role}`}
                                            >
                                                <option value="customer">
                                                    Customer
                                                </option>

                                                <option value="admin">
                                                    Admin
                                                </option>

                                                <option value="superadmin">
                                                    Super Admin
                                                </option>

                                            </select>

                                        ) : (

                                            <span
                                                className={`admin-user-role-badge role-${user.role}`}
                                            >
                                                {
                                                    user.role
                                                }
                                            </span>

                                        )}

                                    </div>


                                    {/* STATUS */}

                                    <div className="admin-user-status">

                                        <span
                                            className={
                                                user.isActive
                                                    ? "user-status-badge active"
                                                    : "user-status-badge inactive"
                                            }
                                        >
                                            {user.isActive ? (
                                                <>
                                                    <CheckCircle2
                                                        size={13}
                                                    />

                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle
                                                        size={13}
                                                    />

                                                    Inactive
                                                </>
                                            )}
                                        </span>

                                    </div>


                                    {/* ACTIONS */}

                                    {isSuperAdmin && (

                                        <div className="admin-user-actions">

                                            <button
                                                className={
                                                    user.isActive
                                                        ? "admin-user-toggle deactivate"
                                                        : "admin-user-toggle activate"
                                                }

                                                disabled={
                                                    updatingId ===
                                                        user._id ||
                                                    isSelf
                                                }

                                                onClick={() =>
                                                    toggleActive(
                                                        user
                                                    )
                                                }
                                            >
                                                {user.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>


                                            <button
                                                className="admin-user-password"

                                                onClick={() => {
                                                    setResetUser(
                                                        user
                                                    );

                                                    setResetPassword(
                                                        ""
                                                    );
                                                }}
                                            >
                                                <KeyRound
                                                    size={14}
                                                />
                                            </button>


                                            <button
                                                className="admin-user-delete"

                                                disabled={
                                                    isSelf
                                                }

                                                onClick={() =>
                                                    setDeleteUser(
                                                        user
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={14}
                                                />
                                            </button>

                                        </div>

                                    )}

                                </motion.article>
                            );
                        }
                    )}

                </div>

            </div>


            {/* =========================
                CREATE ADMIN MODAL
            ========================= */}

            <AnimatePresence>

                {createModal && (

                    <div
                        className="admin-users-modal-overlay"

                        onClick={() =>
                            setCreateModal(
                                false
                            )
                        }
                    >

                        <motion.div
                            className="admin-users-modal admin-create-modal"

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

                            exit={{
                                opacity: 0,
                                scale: 0.95
                            }}

                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="admin-users-modal-header">

                                <div>
                                    <span>
                                        NEW ADMINISTRATOR
                                    </span>

                                    <h2>
                                        Create admin
                                    </h2>
                                </div>


                                <button
                                    onClick={() =>
                                        setCreateModal(
                                            false
                                        )
                                    }
                                >
                                    <X
                                        size={19}
                                    />
                                </button>

                            </div>


                            <form
                                className="admin-users-form"

                                onSubmit={
                                    handleCreateAdmin
                                }
                            >

                                <div className="admin-users-form-grid">

                                    <div className="admin-users-field">

                                        <label>
                                            Full Name *
                                        </label>

                                        <input
                                            name="fullName"

                                            value={
                                                adminForm.fullName
                                            }

                                            onChange={
                                                handleAdminChange
                                            }

                                            placeholder="Full name"
                                        />

                                    </div>


                                    <div className="admin-users-field">

                                        <label>
                                            Username *
                                        </label>

                                        <input
                                            name="username"

                                            value={
                                                adminForm.username
                                            }

                                            onChange={
                                                handleAdminChange
                                            }

                                            placeholder="username"
                                        />

                                    </div>

                                </div>


                                <div className="admin-users-field">

                                    <label>
                                        Email *
                                    </label>

                                    <input
                                        name="email"
                                        type="email"

                                        value={
                                            adminForm.email
                                        }

                                        onChange={
                                            handleAdminChange
                                        }

                                        placeholder="admin@email.com"
                                    />

                                </div>


                                <div className="admin-users-field">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        type="tel"

                                        value={
                                            adminForm.phone
                                        }

                                        onChange={
                                            handleAdminChange
                                        }

                                        placeholder="Phone number"
                                    />

                                </div>


                                <div className="admin-users-form-grid">

                                    <div className="admin-users-field">

                                        <label>
                                            Password *
                                        </label>

                                        <div className="admin-users-password-input">

                                            <input
                                                name="password"

                                                type={
                                                    showAdminPassword
                                                        ? "text"
                                                        : "password"
                                                }

                                                value={
                                                    adminForm.password
                                                }

                                                onChange={
                                                    handleAdminChange
                                                }

                                                placeholder="Minimum 8 characters"
                                            />


                                            <button
                                                type="button"

                                                onClick={() =>
                                                    setShowAdminPassword(
                                                        current =>
                                                            !current
                                                    )
                                                }
                                            >
                                                {showAdminPassword ? (
                                                    <EyeOff
                                                        size={16}
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={16}
                                                    />
                                                )}
                                            </button>

                                        </div>

                                    </div>


                                    <div className="admin-users-field">

                                        <label>
                                            Role
                                        </label>

                                        <select
                                            name="role"

                                            value={
                                                adminForm.role
                                            }

                                            onChange={
                                                handleAdminChange
                                            }
                                        >
                                            <option value="admin">
                                                Admin
                                            </option>

                                            <option value="superadmin">
                                                Super Admin
                                            </option>
                                        </select>

                                    </div>

                                </div>


                                <div className="admin-users-modal-actions">

                                    <button
                                        type="button"

                                        className="admin-users-cancel"

                                        onClick={() =>
                                            setCreateModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"

                                        className="admin-users-save"

                                        disabled={
                                            creatingAdmin
                                        }
                                    >
                                        {creatingAdmin
                                            ? "Creating..."
                                            : "Create Administrator"}
                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </div>
                )}

            </AnimatePresence>


            {/* =========================
                RESET PASSWORD MODAL
            ========================= */}

            <AnimatePresence>

                {resetUser && (

                    <div
                        className="admin-users-modal-overlay"

                        onClick={() =>
                            setResetUser(
                                null
                            )
                        }
                    >

                        <motion.div
                            className="admin-users-modal admin-reset-modal"

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

                            <div className="admin-reset-icon">
                                <KeyRound
                                    size={22}
                                />
                            </div>

                            <h2>
                                Reset password
                            </h2>

                            <p>
                                Set a new password
                                for{" "}
                                <strong>
                                    {resetUser.fullName ||
                                        resetUser.email}
                                </strong>
                                .
                            </p>


                            <div className="admin-users-password-input reset">

                                <input
                                    type={
                                        showResetPassword
                                            ? "text"
                                            : "password"
                                    }

                                    value={
                                        resetPassword
                                    }

                                    onChange={
                                        event =>
                                            setResetPassword(
                                                event.target.value
                                            )
                                    }

                                    placeholder="Minimum 8 characters"
                                />


                                <button
                                    type="button"

                                    onClick={() =>
                                        setShowResetPassword(
                                            current =>
                                                !current
                                        )
                                    }
                                >
                                    {showResetPassword ? (
                                        <EyeOff
                                            size={16}
                                        />
                                    ) : (
                                        <Eye
                                            size={16}
                                        />
                                    )}
                                </button>

                            </div>


                            <div className="admin-users-modal-actions">

                                <button
                                    className="admin-users-cancel"

                                    onClick={() =>
                                        setResetUser(
                                            null
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    className="admin-users-save"

                                    disabled={
                                        resettingPassword
                                    }

                                    onClick={
                                        handleResetPassword
                                    }
                                >
                                    {resettingPassword
                                        ? "Updating..."
                                        : "Reset Password"}
                                </button>

                            </div>

                        </motion.div>

                    </div>
                )}

            </AnimatePresence>


            {/* =========================
                DELETE MODAL
            ========================= */}

            <AnimatePresence>

                {deleteUser && (

                    <div
                        className="admin-users-modal-overlay"

                        onClick={() =>
                            setDeleteUser(
                                null
                            )
                        }
                    >

                        <motion.div
                            className="admin-users-modal admin-delete-user-modal"

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

                            <div className="admin-delete-user-icon">
                                <Trash2
                                    size={22}
                                />
                            </div>

                            <h2>
                                Delete user?
                            </h2>

                            <p>
                                This will permanently
                                remove{" "}
                                <strong>
                                    {deleteUser.fullName ||
                                        deleteUser.email}
                                </strong>
                                .
                            </p>


                            <div className="admin-users-modal-actions">

                                <button
                                    className="admin-users-cancel"

                                    onClick={() =>
                                        setDeleteUser(
                                            null
                                        )
                                    }
                                >
                                    Keep User
                                </button>


                                <button
                                    className="admin-users-delete-confirm"

                                    disabled={
                                        deletingId ===
                                        deleteUser._id
                                    }

                                    onClick={
                                        handleDelete
                                    }
                                >
                                    {deletingId ===
                                    deleteUser._id
                                        ? "Deleting..."
                                        : "Delete User"}
                                </button>

                            </div>

                        </motion.div>

                    </div>
                )}

            </AnimatePresence>

        </section>
    );
}