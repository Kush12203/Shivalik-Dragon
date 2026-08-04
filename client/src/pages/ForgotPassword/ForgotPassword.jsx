import {
    ArrowLeft,
    MessageCircle,
    ShieldCheck,
    KeyRound
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import "./forgotPassword.css";

export default function ForgotPassword() {
    const navigate =
        useNavigate();
    // const whatsappNumber =
    // import.meta.env.VITE_WHATSAPP_NUMBER;

    const openWhatsApp = () => {
        const message =
            "Hi Shivalik Dragon, I forgot my account password and need help recovering my account.";

        const url =
    `https://wa.me/917359760171?text=${encodeURIComponent(
        message
    )}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <main className="forgot-page">

            <div className="forgot-glow forgot-glow-left" />
            <div className="forgot-glow forgot-glow-right" />

            <div className="forgot-container">

                {/* =========================
                    HERO
                ========================= */}

                <section className="forgot-hero">

                    <div className="forgot-badge">
                        <ShieldCheck size={15} />

                        <span>
                            ACCOUNT RECOVERY
                        </span>
                    </div>

                    <h1>
                        Forgot your
                        <span> password?</span>
                    </h1>

                    <p>
                        Don't worry. We'll help you
                        regain access to your
                        Shivalik Dragon account.
                    </p>

                </section>


                {/* =========================
                    RECOVERY CARD
                ========================= */}

                <section className="forgot-card">

                    <div className="forgot-icon">
                        <KeyRound size={28} />
                    </div>

                    <span className="forgot-card-label">
                        PASSWORD SUPPORT
                    </span>

                    <h2>
                        Recover your account
                    </h2>

                    <p className="forgot-description">
                        Password recovery is currently
                        handled through Shivalik Dragon
                        support.
                    </p>

                    <div className="forgot-info">

                        <div className="forgot-info-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <p>
                            Contact us on WhatsApp using
                            your registered
                            <strong>
                                {" "}name, email address
                                or phone number.
                            </strong>
                            {" "}After verification,
                            our team will help you
                            regain access to your
                            account.
                        </p>

                    </div>


                    {/* =========================
                        WHATSAPP
                    ========================= */}

                    <button
                        type="button"
                        className="forgot-whatsapp"
                        onClick={openWhatsApp}
                    >
                        <MessageCircle size={19} />

                        Contact us on WhatsApp
                    </button>


                    {/* =========================
                        BACK
                    ========================= */}

                    <button
                        type="button"
                        className="forgot-back"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        <ArrowLeft size={17} />

                        Back to Sign In
                    </button>

                    <p className="forgot-note">
                        For your security, we may ask
                        you to verify your registered
                        account details before
                        assisting with password
                        recovery.
                    </p>

                </section>

            </div>

        </main>
    );
}