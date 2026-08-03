import {
    Mail,
    MapPin,
    Phone,
    MessageCircle,
    ArrowUpRight
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import "./footer.css";

export default function Footer() {
    const navigate =
        useNavigate();

    const currentYear =
        new Date().getFullYear();

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const goTo = path => {
        navigate(path);

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 50);
    };

    return (
        <footer className="site-footer">
            <div className="footer-glow footer-glow-left" />
            <div className="footer-glow footer-glow-right" />

            <div className="footer-container">

                {/* =========================
                    MAIN
                ========================= */}

                <div className="footer-main">

                    {/* =========================
                        BRAND
                    ========================= */}

                    <div className="footer-brand">

                        <button
                            type="button"
                            className="footer-brand-button"
                            onClick={() =>
                                goTo("/")
                            }
                        >
                            <div className="footer-brand-mark">
                                <span />
                            </div>

                            <div className="footer-brand-copy">

                                <div className="footer-brand-title">

                                    <span className="footer-brand-shivalik">
                                        Shivalik
                                    </span>

                                    <span className="footer-brand-dragon">
                                        Dragon
                                    </span>

                                </div>

                                <span className="footer-tagline">
                                    Fresh. Direct. Trusted.
                                </span>

                            </div>
                        </button>

                        <p className="footer-brand-description">
                            Premium Dragon Fruit,
                            directly from our farm
                            with a simple and trusted
                            ordering experience.
                        </p>

                    </div>


                    {/* =========================
                        QUICK ACTIONS
                    ========================= */}

                    <div className="footer-quick-actions">

                        <span className="footer-section-label">
                            QUICK ACTIONS
                        </span>

                        <div className="footer-actions">

                            {/* SHOP NOW */}

                            <button
                                type="button"
                                className="footer-shop-button"
                                onClick={() =>
                                    goTo("/products")
                                }
                            >
                                Shop Now

                                <ArrowUpRight
                                    size={16}
                                />
                            </button>


                            {/* VISIT FARM */}

                            <button
                                type="button"
                                className="footer-location-button"
                                onClick={() =>
                                    goTo("/location")
                                }
                            >
                                <MapPin
                                    size={16}
                                />

                                Visit Farm
                            </button>


                            {/* WHATSAPP */}

                            <a
                                href="https://wa.me/919426137902"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-whatsapp-button"
                            >
                                <MessageCircle
                                    size={16}
                                />

                                WhatsApp
                            </a>

                        </div>

                    </div>


                    {/* =========================
                        CONTACT
                    ========================= */}

                    <div className="footer-contact-section">

                        <span className="footer-section-label">
                            GET IN TOUCH
                        </span>

                        <div className="footer-contact-grid">

                            {/* EMAIL */}

                            <a
                                href="mailto:shivalikdragonfarm@gmail.com"
                                className="footer-contact-card"
                            >
                                <div className="footer-contact-icon">
                                    <Mail
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        shivalikdragonfarm@gmail.com
                                    </strong>
                                </div>
                            </a>


                            {/* PHONE */}

                            <a
                                href="tel:+919426137902"
                                className="footer-contact-card"
                            >
                                <div className="footer-contact-icon">
                                    <Phone
                                        size={17}
                                    />
                                </div>

                                <div>
                                    <span>
                                        Call us
                                    </span>

                                    <strong>
                                        +91 94261 37902
                                    </strong>
                                </div>
                            </a>


                            {/* INSTAGRAM */}

                            <a
                                href="https://www.instagram.com/shivalikdragon/"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-contact-card"
                            >
                                <div className="footer-contact-icon footer-instagram-icon">
                                    IG
                                </div>

                                <div>
                                    <span>
                                        Instagram
                                    </span>

                                    <strong>
                                        @shivalikdragon
                                    </strong>
                                </div>
                            </a>

                        </div>

                    </div>

                </div>


                {/* =========================
                    BOTTOM
                ========================= */}

                <div className="footer-bottom">

                    <div />

                    <p>
                        © {currentYear} Shivalik Dragon.
                        All rights reserved.
                    </p>

                    <button
                        type="button"
                        className="footer-back-top"
                        onClick={scrollTop}
                    >
                        Back to top ↑
                    </button>

                </div>

            </div>
        </footer>
    );
}