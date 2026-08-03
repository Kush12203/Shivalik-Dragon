import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    User,
    UserPlus
} from "lucide-react";

import {
    GoogleLogin
} from "@react-oauth/google";

import {
    motion
} from "framer-motion";

import toast from "react-hot-toast";

import {
    useAuth
} from "../../context/AuthContext";

import "../Auth/auth.css";

export default function Register() {
    const navigate =
        useNavigate();

    const {
        register,
        googleLogin
    } = useAuth();

    const [
        form,
        setForm
    ] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword:
            ""
    });

    const [
        showPassword,
        setShowPassword
    ] = useState(false);

    const [
        loading,
        setLoading
    ] = useState(false);

    const handleChange =
        (
            event
        ) => {
            const {
                name,
                value
            } = event.target;

            setForm(
                (
                    current
                ) => ({
                    ...current,

                    [name]:
                        value
                })
            );
        };

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            if (
                !form.fullName.trim() ||
                !form.email.trim() ||
                !form.phone.trim() ||
                !form.password
            ) {
                toast.error(
                    "Please complete all required fields."
                );

                return;
            }

            if (
                form.password.length <
                8
            ) {
                toast.error(
                    "Password must contain at least 8 characters."
                );

                return;
            }

            if (
                form.password !==
                form.confirmPassword
            ) {
                toast.error(
                    "Passwords do not match."
                );

                return;
            }

            try {
                setLoading(
                    true
                );

                await register({
                    fullName:
                        form.fullName,

                    username:
                        form.username ||
                        undefined,

                    email:
                        form.email,

                    phone:
                        form.phone,

                    password:
                        form.password
                });

                toast.success(
                    "Account created successfully."
                );

                navigate("/");
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to create account."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    const handleGoogleSuccess =
        async (
            credentialResponse
        ) => {
            try {
                if (
                    !credentialResponse
                        .credential
                ) {
                    return;
                }

                const result =
                    await googleLogin(
                        credentialResponse
                            .credential
                    );

                toast.success(
                    "Google account connected."
                );

                if (
                    result.needsPhone
                ) {
                    navigate(
                        "/account",
                        {
                            state: {
                                completePhone:
                                    true
                            }
                        }
                    );

                    return;
                }

                navigate("/");
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Google registration failed."
                );
            }
        };

    return (
        <section className="auth-page">
            <div className="auth-glow auth-glow-left" />
            <div className="auth-glow auth-glow-right" />

            <div className="auth-wrapper register-wrapper">
                <motion.div
                    className="auth-side"
                    initial={{
                        opacity: 0,
                        x: -25
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                >
                    <div className="auth-side-badge">
                        <UserPlus
                            size={16}
                        />

                        Create Account
                    </div>

                    <h1>
                        Your Shivalik Dragon
                        <span>
                            {" "}
                            account starts here.
                        </span>
                    </h1>

                    <p>
                        Create an account to place
                        orders, view your order
                        history and stay updated on
                        every order.
                    </p>

                    <div className="auth-stat-grid">
                        <div>
                            <strong>
                                Fast
                            </strong>

                            <span>
                                Simple checkout
                            </span>
                        </div>

                        <div>
                            <strong>
                                Secure
                            </strong>

                            <span>
                                Protected access
                            </span>
                        </div>

                        <div>
                            <strong>
                                Easy
                            </strong>

                            <span>
                                Order tracking
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="auth-card auth-card-large"
                    initial={{
                        opacity: 0,
                        y: 24
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                >
                    <div className="auth-card-header">
                        <span>
                            CREATE ACCOUNT
                        </span>

                        <h2>
                            Join Shivalik Dragon
                        </h2>

                        <p>
                            Enter your details
                            below.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="auth-form-grid">
                            <div className="auth-field">
                                <label>
                                    Full Name *
                                </label>

                                <div className="auth-input-wrapper">
                                    <User
                                        size={
                                            18
                                        }
                                    />

                                    <input
                                        name="fullName"
                                        placeholder="Your full name"
                                        value={
                                            form.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label>
                                    Username
                                </label>

                                <div className="auth-input-wrapper">
                                    <User
                                        size={
                                            18
                                        }
                                    />

                                    <input
                                        name="username"
                                        placeholder="Optional username"
                                        value={
                                            form.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label>
                                Email *
                            </label>

                            <div className="auth-input-wrapper">
                                <Mail
                                    size={18}
                                />

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label>
                                Phone Number *
                            </label>

                            <div className="auth-input-wrapper">
                                <Phone
                                    size={18}
                                />

                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Your phone number"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="auth-form-grid">
                            <div className="auth-field">
                                <label>
                                    Password *
                                </label>

                                <div className="auth-input-wrapper">
                                    <LockKeyhole
                                        size={
                                            18
                                        }
                                    />

                                    <input
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Minimum 8 characters"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label>
                                    Confirm Password *
                                </label>

                                <div className="auth-input-wrapper">
                                    <LockKeyhole
                                        size={
                                            18
                                        }
                                    />

                                    <input
                                        name="confirmPassword"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Repeat password"
                                        value={
                                            form.confirmPassword
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (
                                                    value
                                                ) =>
                                                    !value
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={
                                                    18
                                                }
                                            />
                                        ) : (
                                            <Eye
                                                size={
                                                    18
                                                }
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={
                                loading
                            }
                        >
                            <UserPlus
                                size={18}
                            />

                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>
                            or continue with
                        </span>
                    </div>

                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={
                                handleGoogleSuccess
                            }
                            onError={() =>
                                toast.error(
                                    "Google login failed."
                                )
                            }
                            theme="outline"
                            size="large"
                            shape="pill"
                            text="signup_with"
                            width="350"
                        />
                    </div>

                    <p className="auth-switch">
                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}