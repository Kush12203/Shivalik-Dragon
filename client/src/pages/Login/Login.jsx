import {
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    LogIn,
    Mail,
    ShieldCheck
} from "lucide-react";

import {
    GoogleLogin
} from "@react-oauth/google";

import toast from "react-hot-toast";

import {
    motion
} from "framer-motion";

import {
    useAuth
} from "../../context/AuthContext";

import "../Auth/auth.css";

export default function Login() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login,
        googleLogin
    } = useAuth();

    const [
        identifier,
        setIdentifier
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const [
        showPassword,
        setShowPassword
    ] = useState(false);

    const [
        loading,
        setLoading
    ] = useState(false);

    const redirectTo =
        location.state?.from ||
        "/";

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            if (
                !identifier.trim() ||
                !password
            ) {
                toast.error(
                    "Enter your email/username and password."
                );

                return;
            }

            try {
                setLoading(
                    true
                );

                await login(
                    identifier,
                    password
                );

                toast.success(
                    "Welcome back."
                );

                navigate(
                    redirectTo,
                    {
                        replace: true
                    }
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Unable to login."
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
                    toast.error(
                        "Google login could not be completed."
                    );

                    return;
                }

                const result =
                    await googleLogin(
                        credentialResponse
                            .credential
                    );

                toast.success(
                    "Google login successful."
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

                navigate(
                    redirectTo,
                    {
                        replace: true
                    }
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        "Google login failed."
                );
            }
        };

    return (
        <section className="auth-page">
            <div className="auth-glow auth-glow-left" />
            <div className="auth-glow auth-glow-right" />

            <div className="auth-wrapper">
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
                    transition={{
                        duration: 0.65
                    }}
                >
                    <div className="auth-side-badge">
                        <ShieldCheck
                            size={16}
                        />

                        Secure Access
                    </div>

                    <h1>
                        Welcome back to
                        <span>
                            {" "}
                            Shivalik Dragon.
                        </span>
                    </h1>

                    <p>
                        Sign in to manage your
                        orders, view history,
                        track order status and
                        keep everything in one
                        secure account.
                    </p>

                    <div className="auth-benefits">
                        <div>
                            <span>
                                01
                            </span>

                            <div>
                                <strong>
                                    Simple ordering
                                </strong>

                                <small>
                                    Place and manage
                                    your orders easily.
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>
                                02
                            </span>

                            <div>
                                <strong>
                                    Order history
                                </strong>

                                <small>
                                    Keep track of
                                    previous and active
                                    orders.
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>
                                03
                            </span>

                            <div>
                                <strong>
                                    Secure account
                                </strong>

                                <small>
                                    Your account
                                    information remains
                                    protected.
                                </small>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="auth-card"
                    initial={{
                        opacity: 0,
                        y: 24
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.08
                    }}
                >
                    <div className="auth-card-header">
                        <span>
                            SIGN IN
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Enter your account
                            details to continue.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="auth-field">
                            <label>
                                Email or Username
                            </label>

                            <div className="auth-input-wrapper">
                                <Mail
                                    size={18}
                                />

                                <input
                                    type="text"
                                    placeholder="Enter email or username"
                                    value={
                                        identifier
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setIdentifier(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <div className="auth-field-top">
                                <label>
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="auth-input-wrapper">
                                <LockKeyhole
                                    size={18}
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event
                                                .target
                                                .value
                                        )
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

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "Signing In..."
                                : (
                                    <>
                                        <LogIn
                                            size={
                                                18
                                            }
                                        />

                                        Sign In
                                    </>
                                )}
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
                            text="continue_with"
                            width="350"
                        />
                    </div>

                    <p className="auth-switch">
                        Don't have an account?

                        <Link to="/register">
                            Create account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}