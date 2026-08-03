import {
    ArrowRight,
    BadgeCheck,
    Leaf,
    MapPin,
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Sparkles
} from "lucide-react";

import {
    motion
} from "framer-motion";

import {
    useNavigate
} from "react-router-dom";

import "./home.css";

import dragonFruitHero from "../../assets/images/dragon-fruit-hero.png";

export default function Home() {
    const navigate =
        useNavigate();

    const highlights = [
        {
            icon: Leaf,
            title: "Fresh Selection",
            text:
                "Products are selected with quality and freshness in mind."
        },

        {
            icon: PackageCheck,
            title: "Direct Ordering",
            text:
                "Choose your quantity and place an order directly through your account."
        },

        {
            icon: ShieldCheck,
            title: "Secure Account",
            text:
                "Your cart, orders and account information stay behind protected access."
        },

        {
            icon: BadgeCheck,
            title: "Simple Experience",
            text:
                "A clean ordering experience designed to keep everything easy to manage."
        }
    ];

    return (
        <div className="home-page">

            {/* =========================
                HERO
            ========================= */}

            <section className="hero-section">

                <div className="hero-glow hero-glow-one" />
                <div className="hero-glow hero-glow-two" />

                <div className="hero-grid-pattern" />

                <div className="hero-container">

                    <motion.div
                        className="hero-content"

                        initial={{
                            opacity: 0,
                            y: 25
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        transition={{
                            duration: 0.75
                        }}
                    >

                        <div className="hero-badge">

                            <Sparkles
                                size={15}
                            />

                            Fresh selection
                            available directly

                        </div>

                        <h1>
                            Freshness
                            <span>
                                {" "}
                                with a
                                distinctive edge.
                            </span>
                        </h1>

                        <p className="hero-description">
                            Explore premium
                            Dragon Fruit,
                            place your order
                            online, and keep
                            track of everything
                            from one secure
                            account.
                        </p>

                        <div className="hero-actions">

                            <button
                                className="primary-hero-button"

                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                            >
                                Explore Products

                                <ArrowRight
                                    size={18}
                                />
                            </button>

                            <button
                                className="secondary-hero-button"

                                onClick={() =>
                                    navigate(
                                        "/location"
                                    )
                                }
                            >
                                <MapPin
                                    size={17}
                                />

                                View Location
                            </button>

                        </div>

                        <div className="hero-features">

                            <div>

                                <ShieldCheck
                                    size={18}
                                />

                                <span>
                                    Secure
                                    account access
                                </span>

                            </div>

                            <div>

                                <ShoppingBag
                                    size={18}
                                />

                                <span>
                                    Easy ordering
                                </span>

                            </div>

                            <div>

                                <Sparkles
                                    size={18}
                                />

                                <span>
                                    Fresh products
                                </span>

                            </div>

                        </div>

                    </motion.div>


                    {/* HERO VISUAL */}

                    <motion.div
                        className="hero-visual"

                        initial={{
                            opacity: 0,
                            scale: 0.94
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1
                        }}

                        transition={{
                            duration: 0.8,
                            delay: 0.15
                        }}
                    >

                        <div className="fruit-orb">

                            <div className="fruit-orb-inner">

                                <img
                                    src={
                                        dragonFruitHero
                                    }

                                    alt="Fresh Dragon Fruit"

                                    className="hero-fruit-image"
                                />

                            </div>

                        </div>

                        <motion.div
                            className="floating-card floating-card-one"

                            animate={{
                                y: [
                                    0,
                                    -9,
                                    0
                                ]
                            }}

                            transition={{
                                duration: 3.5,
                                repeat: Infinity
                            }}
                        >

                            <span>
                                Fresh
                            </span>

                            <strong>
                                Premium Selection
                            </strong>

                        </motion.div>

                        <motion.div
                            className="floating-card floating-card-two"

                            animate={{
                                y: [
                                    0,
                                    8,
                                    0
                                ]
                            }}

                            transition={{
                                duration: 4,
                                repeat: Infinity
                            }}
                        >

                            <span>
                                Ordering
                            </span>

                            <strong>
                                Simple & Secure
                            </strong>

                        </motion.div>

                    </motion.div>

                </div>

            </section>


            {/* =========================
                INTRO
            ========================= */}

            <section
                className="home-intro"
                id="about"
            >

                <motion.div
                    className="section-heading"

                    initial={{
                        opacity: 0,
                        y: 25
                    }}

                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}

                    viewport={{
                        once: true,
                        amount: 0.25
                    }}
                >

                    <span>
                        SHIVALIK DRAGON
                    </span>

                    <h2>
                        Built around
                        freshness,
                        simplicity and
                        trust.
                    </h2>

                    <p>
                        Shivalik Dragon brings
                        products, ordering,
                        account history and
                        order tracking together
                        in one modern
                        experience.
                    </p>

                </motion.div>

            </section>


            {/* =========================
                OUR APPROACH
            ========================= */}

            <section className="home-approach">

                <div className="home-section-container">

                    <motion.div
                        className="approach-card"

                        initial={{
                            opacity: 0,
                            y: 30
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true,
                            amount: 0.2
                        }}
                    >

                        <div className="approach-label">

                            <span>
                                OUR APPROACH
                            </span>

                            <div />

                        </div>


                        <div className="approach-content">

                            <div>

                                <h2>
                                    From our farm,
                                    <strong>
                                        {" "}
                                        directly to you.
                                    </strong>
                                </h2>

                            </div>


                            <div className="approach-text">

                                <p>
                                    We focus on making 
                                    fresh Dragon Fruit 
                                    easy to discover and 
                                    order directly through 
                                    Shivalik Dragon.
                                </p>

                                <p>
                                    From selecting your quantity 
                                    to tracking your order, 
                                    everything is designed to 
                                    keep the experience simple, 
                                    transparent and convenient.
                                </p>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>


            {/* =========================
                HIGHLIGHTS
            ========================= */}

            <section className="home-highlights-section">

                <div className="home-section-container">

                    <motion.div
                        className="home-section-title"

                        initial={{
                            opacity: 0,
                            y: 20
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true
                        }}
                    >

                        <span>
                            THE EXPERIENCE
                        </span>

                        <h2>
                            Designed to keep
                            everything
                            <strong>
                                {" "}
                                effortless.
                            </strong>
                        </h2>

                    </motion.div>


                    <div className="home-highlights">

                        {highlights.map(
                            (
                                item,
                                index
                            ) => {

                                const Icon =
                                    item.icon;

                                return (

                                    <motion.article
                                        key={
                                            item.title
                                        }

                                        className="home-highlight-card"

                                        initial={{
                                            opacity: 0,
                                            y: 25
                                        }}

                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}

                                        viewport={{
                                            once: true,
                                            amount: 0.2
                                        }}

                                        transition={{
                                            delay:
                                                index *
                                                0.07
                                        }}
                                    >

                                        <div className="home-highlight-icon">

                                            <Icon
                                                size={21}
                                            />

                                        </div>

                                        <h3>
                                            {
                                                item.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                item.text
                                            }
                                        </p>

                                    </motion.article>

                                );
                            }
                        )}

                    </div>

                </div>

            </section>


            {/* =========================
                ORDERING STEPS
            ========================= */}

            <section className="home-process-section">

                <div className="home-section-container">

                    <motion.div
                        className="home-process-card"

                        initial={{
                            opacity: 0,
                            y: 25
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true,
                            amount: 0.2
                        }}
                    >

                        <div className="home-process-intro">

                            <span>
                                HOW IT WORKS
                            </span>

                            <h2>
                                Everything you
                                need
                                <strong>
                                    {" "}
                                    in one place.
                                </strong>
                            </h2>

                            <p>
                                From discovering
                                products to
                                tracking the
                                final order,
                                everything stays
                                connected.
                            </p>

                        </div>


                        <div className="home-process-steps">

                            <div className="home-process-step">

                                <span>
                                    01
                                </span>

                                <div>

                                    <strong>
                                        Browse
                                    </strong>

                                    <p>
                                        Explore
                                        available
                                        products,
                                        pricing and
                                        availability.
                                    </p>

                                </div>

                            </div>


                            <div className="home-process-step">

                                <span>
                                    02
                                </span>

                                <div>

                                    <strong>
                                        Add to Cart
                                    </strong>

                                    <p>
                                        Select your
                                        preferred
                                        quantity and
                                        keep it ready
                                        in your cart.
                                    </p>

                                </div>

                            </div>


                            <div className="home-process-step">

                                <span>
                                    03
                                </span>

                                <div>

                                    <strong>
                                        Place Order
                                    </strong>

                                    <p>
                                        Sign in and
                                        confirm your
                                        order securely.
                                    </p>

                                </div>

                            </div>


                            <div className="home-process-step">

                                <span>
                                    04
                                </span>

                                <div>

                                    <strong>
                                        Track
                                    </strong>

                                    <p>
                                        Follow order
                                        status and
                                        history from
                                        My Orders.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>


            {/* =========================
                CTA
            ========================= */}

            <section className="home-cta-section">

                <div className="home-section-container">

                    <motion.div
                        className="home-cta"

                        initial={{
                            opacity: 0,
                            scale: 0.97
                        }}

                        whileInView={{
                            opacity: 1,
                            scale: 1
                        }}

                        viewport={{
                            once: true
                        }}
                    >

                        <div>

                            <span>
                                READY TO ORDER?
                            </span>

                            <h2>
                                Explore what's
                                <strong>
                                    {" "}
                                    available today.
                                </strong>
                            </h2>

                            <p>
                                Browse current
                                products and place
                                your order in just
                                a few steps.
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                        >
                            Explore Products

                            <ArrowRight
                                size={17}
                            />
                        </button>

                    </motion.div>

                </div>

            </section>

        </div>
    );
}