import {
    useEffect,
    useState
} from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    LogOut,
    Mail,
    Package,
    Phone,
    Save,
    ShieldCheck,
    User,
    UserRound,
    AlertCircle
} from "lucide-react";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import api from "../../services/api";

import {
    useAuth
} from "../../context/AuthContext";

import "./account.css";

export default function Account() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        user,
        setUser,
        logout
    } = useAuth();

    const [
        profile,
        setProfile
    ] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: ""
    });

    const [
        originalProfile,
        setOriginalProfile
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        passwordLoading,
        setPasswordLoading
    ] = useState(false);

    const [
        passwordForm,
        setPasswordForm
    ] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [
        showCurrentPassword,
        setShowCurrentPassword
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false);

    const shouldCompletePhone =
        location.state?.completePhone ||
        !user?.phone;

    // =========================
    // LOAD PROFILE
    // =========================

    const loadProfile =
        async () => {
            try {
                setLoading(true);

                const response =
                    await api.get(
                        "/profile"
                    );

                const currentUser =
                    response.data.user;

                const values = {
                    fullName:
                        currentUser.fullName ||
                        "",

                    username:
                        currentUser.username ||
                        "",

                    email:
                        currentUser.email ||
                        "",

                    phone:
                        currentUser.phone ||
                        ""
                };

                setProfile(
                    values
                );

                setOriginalProfile(
                    values
                );

                setUser(
                    currentUser
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadProfile();
    }, []);

    // =========================
    // PROFILE INPUT
    // =========================

    const handleProfileChange =
        (
            event
        ) => {
            const {
                name,
                value
            } = event.target;

            setProfile(
                (
                    current
                ) => ({
                    ...current,

                    [name]:
                        value
                })
            );
        };

    // =========================
    // SAVE PROFILE
    // =========================

    const handleProfileSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            if (
                !profile.fullName.trim()
            ) {
                toast.error(
                    "Full name is required."
                );

                return;
            }

            if (
                !profile.phone.trim()
            ) {
                toast.error(
                    "Phone number is required."
                );

                return;
            }

            try {
                setSaving(true);

                const response =
                    await api.put(
                        "/profile",
                        {
                            fullName:
                                profile.fullName,

                            username:
                                profile.username,

                            phone:
                                profile.phone
                        }
                    );

                setUser(
                    response.data.user
                );

                const updated = {
                    fullName:
                        response.data.user
                            .fullName ||
                        "",

                    username:
                        response.data.user
                            .username ||
                        "",

                    email:
                        response.data.user
                            .email ||
                        profile.email,

                    phone:
                        response.data.user
                            .phone ||
                        ""
                };

                setProfile(
                    updated
                );

                setOriginalProfile(
                    updated
                );

                toast.success(
                    "Profile updated successfully."
                );

                if (
                    location.state
                        ?.completePhone
                ) {
                    window.history
                        .replaceState(
                            {},
                            document.title
                        );
                }
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to update profile."
                );
            } finally {
                setSaving(false);
            }
        };

    // =========================
    // PASSWORD INPUT
    // =========================

    const handlePasswordChange =
        (
            event
        ) => {
            const {
                name,
                value
            } = event.target;

            setPasswordForm(
                (
                    current
                ) => ({
                    ...current,

                    [name]:
                        value
                })
            );
        };

    // =========================
    // CHANGE PASSWORD
    // =========================

    const handlePasswordSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            if (
                !passwordForm
                    .currentPassword ||
                !passwordForm
                    .newPassword ||
                !passwordForm
                    .confirmPassword
            ) {
                toast.error(
                    "Complete all password fields."
                );

                return;
            }

            if (
                passwordForm
                    .newPassword
                    .length <
                8
            ) {
                toast.error(
                    "New password must contain at least 8 characters."
                );

                return;
            }

            if (
                passwordForm
                    .newPassword !==
                passwordForm
                    .confirmPassword
            ) {
                toast.error(
                    "New passwords do not match."
                );

                return;
            }

            try {
                setPasswordLoading(
                    true
                );

                await api.put(
                    "/profile/password",
                    {
                        currentPassword:
                            passwordForm
                                .currentPassword,

                        newPassword:
                            passwordForm
                                .newPassword
                    }
                );

                setPasswordForm({
                    currentPassword:
                        "",

                    newPassword:
                        "",

                    confirmPassword:
                        ""
                });

                toast.success(
                    "Password changed successfully."
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to change password."
                );
            } finally {
                setPasswordLoading(
                    false
                );
            }
        };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout =
        async () => {
            await logout();

            toast.success(
                "Logged out successfully."
            );

            navigate("/");
        };

    const profileChanged =
        JSON.stringify(
            profile
        ) !==
        JSON.stringify(
            originalProfile
        );

    if (loading) {
        return (
            <div className="account-loading">
                <div className="account-loader" />

                <span>
                    Loading your account...
                </span>
            </div>
        );
    }

    return (
        <section className="account-page">
            <div className="account-glow account-glow-left" />
            <div className="account-glow account-glow-right" />

            <div className="account-container">
                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <motion.div
                    className="account-header"
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
                        <span className="account-eyebrow">
                            MY ACCOUNT
                        </span>

                        <h1>
                            Welcome,
                            {" "}
                            <span>
                                {user?.fullName ||
                                    user?.username ||
                                    "Customer"}
                            </span>
                        </h1>

                        <p>
                            Manage your profile,
                            account security and
                            order activity.
                        </p>
                    </div>

                    <button
                        className="account-logout-button"
                        onClick={
                            handleLogout
                        }
                    >
                        <LogOut
                            size={
                                17
                            }
                        />

                        Logout
                    </button>
                </motion.div>

                {/* ========================= */}
                {/* COMPLETE PROFILE */}
                {/* ========================= */}

                {shouldCompletePhone && (
                    <motion.div
                        className="complete-profile-alert"
                        initial={{
                            opacity: 0,
                            y: -10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                    >
                        <div className="complete-profile-icon">
                            <AlertCircle
                                size={
                                    22
                                }
                            />
                        </div>

                        <div>
                            <strong>
                                Complete your
                                profile
                            </strong>

                            <p>
                                Add your phone
                                number before
                                placing an order.
                                This helps us
                                contact you about
                                your order when
                                required.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ========================= */}
                {/* SUMMARY */}
                {/* ========================= */}

                <div className="account-summary-grid">
                    <motion.div
                        className="account-summary-card"
                        whileHover={{
                            y: -4
                        }}
                    >
                        <div className="summary-icon green">
                            <UserRound
                                size={
                                    21
                                }
                            />
                        </div>

                        <div>
                            <span>
                                Account
                            </span>

                            <strong>
                                {user?.role ===
                                "superadmin"
                                    ? "Super Admin"
                                    : user?.role ===
                                      "admin"
                                    ? "Administrator"
                                    : "Customer"}
                            </strong>
                        </div>
                    </motion.div>

                    <motion.div
                        className="account-summary-card"
                        whileHover={{
                            y: -4
                        }}
                    >
                        <div className="summary-icon pink">
                            <Mail
                                size={
                                    21
                                }
                            />
                        </div>

                        <div>
                            <span>
                                Email
                            </span>

                            <strong>
                                {user?.email ||
                                    "Not available"}
                            </strong>
                        </div>
                    </motion.div>

                    <motion.div
                        className="account-summary-card"
                        whileHover={{
                            y: -4
                        }}
                        onClick={() =>
                            navigate(
                                "/orders"
                            )
                        }
                    >
                        <div className="summary-icon blue">
                            <Package
                                size={
                                    21
                                }
                            />
                        </div>

                        <div>
                            <span>
                                Orders
                            </span>

                            <strong>
                                View My Orders
                            </strong>
                        </div>
                    </motion.div>
                </div>

                {/* ========================= */}
                {/* MAIN GRID */}
                {/* ========================= */}

                <div className="account-content-grid">
                    {/* PROFILE */}

                    <motion.div
                        className="account-panel"
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
                                0.08
                        }}
                    >
                        <div className="account-panel-header">
                            <div className="panel-title-icon">
                                <User
                                    size={
                                        20
                                    }
                                />
                            </div>

                            <div>
                                <h2>
                                    Profile
                                    Information
                                </h2>

                                <p>
                                    Update your
                                    personal
                                    information.
                                </p>
                            </div>
                        </div>

                        <form
                            className="account-form"
                            onSubmit={
                                handleProfileSubmit
                            }
                        >
                            <div className="account-form-grid">
                                <div className="account-field">
                                    <label>
                                        Full Name
                                    </label>

                                    <div className="account-input">
                                        <User
                                            size={
                                                17
                                            }
                                        />

                                        <input
                                            name="fullName"
                                            value={
                                                profile.fullName
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div className="account-field">
                                    <label>
                                        Username
                                    </label>

                                    <div className="account-input">
                                        <UserRound
                                            size={
                                                17
                                            }
                                        />

                                        <input
                                            name="username"
                                            value={
                                                profile.username
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Choose username"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="account-field">
                                <label>
                                    Email Address
                                </label>

                                <div className="account-input disabled">
                                    <Mail
                                        size={
                                            17
                                        }
                                    />

                                    <input
                                        value={
                                            profile.email
                                        }
                                        disabled
                                    />

                                    <ShieldCheck
                                        size={
                                            17
                                        }
                                    />
                                </div>

                                <small>
                                    Email address
                                    cannot currently
                                    be changed.
                                </small>
                            </div>

                            <div
                                className={
                                    !profile.phone
                                        ? "account-field phone-required"
                                        : "account-field"
                                }
                            >
                                <label>
                                    Phone Number
                                </label>

                                <div className="account-input">
                                    <Phone
                                        size={
                                            17
                                        }
                                    />

                                    <input
                                        name="phone"
                                        type="tel"
                                        value={
                                            profile.phone
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                {!profile.phone && (
                                    <small className="required-text">
                                        Phone number
                                        is required
                                        before ordering.
                                    </small>
                                )}
                            </div>

                            <button
                                className="save-profile-button"
                                type="submit"
                                disabled={
                                    saving ||
                                    !profileChanged
                                }
                            >
                                {saving ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save
                                            size={
                                                17
                                            }
                                        />

                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* SECURITY */}

                    <motion.div
                        className="account-panel"
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
                                0.14
                        }}
                    >
                        <div className="account-panel-header">
                            <div className="panel-title-icon security">
                                <LockKeyhole
                                    size={
                                        20
                                    }
                                />
                            </div>

                            <div>
                                <h2>
                                    Account
                                    Security
                                </h2>

                                <p>
                                    Manage your
                                    password and
                                    sign-in method.
                                </p>
                            </div>
                        </div>

                        <div className="sign-in-method">
                            <div>
                                <ShieldCheck
                                    size={
                                        19
                                    }
                                />

                                <div>
                                    <span>
                                        Sign-in
                                        method
                                    </span>

                                    <strong>
                                        {user
                                            ?.authProvider ===
                                        "google"
                                            ? "Google Account"
                                            : "Email / Password"}
                                    </strong>
                                </div>
                            </div>

                            <CheckCircle2
                                size={
                                    19
                                }
                            />
                        </div>

                        {user?.authProvider !==
                        "google" ? (
                            <form
                                className="account-form password-form"
                                onSubmit={
                                    handlePasswordSubmit
                                }
                            >
                                <div className="account-field">
                                    <label>
                                        Current
                                        Password
                                    </label>

                                    <div className="account-input">
                                        <LockKeyhole
                                            size={
                                                17
                                            }
                                        />

                                        <input
                                            name="currentPassword"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordForm
                                                    .currentPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Current password"
                                        />

                                        <button
                                            type="button"
                                            className="account-password-toggle"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (
                                                        current
                                                    ) =>
                                                        !current
                                                )
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="account-field">
                                    <label>
                                        New Password
                                    </label>

                                    <div className="account-input">
                                        <LockKeyhole
                                            size={
                                                17
                                            }
                                        />

                                        <input
                                            name="newPassword"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordForm
                                                    .newPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Minimum 8 characters"
                                        />

                                        <button
                                            type="button"
                                            className="account-password-toggle"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (
                                                        current
                                                    ) =>
                                                        !current
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="account-field">
                                    <label>
                                        Confirm New
                                        Password
                                    </label>

                                    <div className="account-input">
                                        <LockKeyhole
                                            size={
                                                17
                                            }
                                        />

                                        <input
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                passwordForm
                                                    .confirmPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Repeat new password"
                                        />

                                        <button
                                            type="button"
                                            className="account-password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (
                                                        current
                                                    ) =>
                                                        !current
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    size={
                                                        17
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        17
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="change-password-button"
                                    type="submit"
                                    disabled={
                                        passwordLoading
                                    }
                                >
                                    <LockKeyhole
                                        size={
                                            17
                                        }
                                    />

                                    {passwordLoading
                                        ? "Updating..."
                                        : "Change Password"}
                                </button>
                            </form>
                        ) : (
                            <div className="google-security-note">
                                <ShieldCheck
                                    size={
                                        24
                                    }
                                />

                                <div>
                                    <strong>
                                        Password
                                        managed by
                                        Google
                                    </strong>

                                    <p>
                                        This account
                                        uses Google
                                        Sign-In, so
                                        your password
                                        is managed
                                        through your
                                        Google
                                        account.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}