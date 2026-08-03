import {
    BadgeCheck,
    Leaf,
    PackageCheck,
    ShieldCheck,
    Sparkles
} from "lucide-react";

import {
    motion
} from "framer-motion";

import {
    useNavigate
} from "react-router-dom";

import dragonFruitHero from "../../assets/images/dragon-fruit-hero.png";

import "./about.css";

export default function About() {
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
                "Place your order directly through a simple and secure system."
        },
        {
            icon: ShieldCheck,
            title: "Secure Account",
            text:
                "Manage your cart, orders and account through protected access."
        },
        {
            icon: BadgeCheck,
            title: "Simple Experience",
            text:
                "A clean ordering experience designed to keep everything easy to manage."
        }
    ];

    return (
        <section className="about-page">

            <div className="about-glow about-glow-left" />
            <div className="about-glow about-glow-right" />

            <div className="about-container">

                {/* HERO */}

                <div className="about-hero">

                    <motion.div
                        className="about-hero-content"

                        initial={{
                            opacity: 0,
                            y: 22
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        transition={{
                            duration: 0.55
                        }}
                    >

                        <div className="about-badge">

                            <Sparkles
                                size={15}
                            />

                            SHIVALIK DRAGON
                        </div>

                        <h1>
                            Freshness,
                            <span>
                                {" "}
                                directly connected.
                            </span>
                        </h1>

                        <p className="about-intro">
                            Shivalik Dragon is built around a simple idea:
                            make discovering, ordering and keeping track of
                            fresh products easy through one modern platform.
                        </p>

                        <div className="about-actions">

                            <button
                                className="about-primary-button"

                                onClick={() =>
                                    navigate(
                                        "/products"
                                    )
                                }
                            >
                                Explore Products
                            </button>

                            <button
                                className="about-secondary-button"

                                onClick={() =>
                                    navigate(
                                        "/location"
                                    )
                                }
                            >
                                View Location
                            </button>

                        </div>

                    </motion.div>


                    {/* IMAGE SIDE */}

                    <motion.div
                        className="about-visual"

                        initial={{
                            opacity: 0,
                            scale: 0.94
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1
                        }}

                        transition={{
                            duration: 0.65,
                            delay: 0.1
                        }}
                    >

                        <div className="about-orb">

                            <div className="about-orb-inner">

                                <img
                                    src={
                                        dragonFruitHero
                                    }

                                    alt="Dragon Fruit"
                                />

                            </div>

                        </div>


                        <div className="about-floating-card about-floating-one">

                            <span>
                                QUALITY
                            </span>

                            <strong>
                                Fresh Selection
                            </strong>

                        </div>


                        <div className="about-floating-card about-floating-two">

                            <span>
                                ORDERING
                            </span>

                            <strong>
                                Simple & Secure
                            </strong>

                        </div>

                    </motion.div>

                </div>


                {/* STORY */}

                <motion.div
                    className="about-story"

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

                    <div className="about-story-label">

                        <span>
                            OUR APPROACH
                        </span>

                        <div />

                    </div>

                    <div className="about-story-content">

                        <h2>
                            Built around
                            <strong>
                                {" "}
                                simplicity.
                            </strong>
                        </h2>

                        <div className="about-story-text">

                            <p>
                                The goal is to keep the complete ordering
                                process straightforward. Customers can browse
                                available products, add their preferred
                                quantity to the cart and place an order from
                                their account.
                            </p>

                            <p>
                                Account holders can review previous orders,
                                monitor current order status and cancel an
                                eligible order whenever necessary.
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* HIGHLIGHTS */}

                <div className="about-highlights">

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

                                    className="about-highlight-card"

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
                                            0.06
                                    }}
                                >

                                    <div className="about-highlight-icon">

                                        <Icon
                                            size={20}
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


                {/* EXPERIENCE SECTION */}

                <motion.div
                    className="about-experience"

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

                    <div className="about-experience-left">

                        <span>
                            THE EXPERIENCE
                        </span>

                        <h2>
                            Everything you need
                            <strong>
                                {" "}
                                in one place.
                            </strong>
                        </h2>

                    </div>


                    <div className="about-experience-steps">

                        <div className="about-step">

                            <span>
                                01
                            </span>

                            <div>
                                <strong>
                                    Browse
                                </strong>

                                <p>
                                    View products,
                                    pricing and
                                    availability.
                                </p>
                            </div>

                        </div>


                        <div className="about-step">

                            <span>
                                02
                            </span>

                            <div>
                                <strong>
                                    Add to Cart
                                </strong>

                                <p>
                                    Select the
                                    quantity you
                                    need.
                                </p>
                            </div>

                        </div>


                        <div className="about-step">

                            <span>
                                03
                            </span>

                            <div>
                                <strong>
                                    Place Order
                                </strong>

                                <p>
                                    Confirm the
                                    order through
                                    your account.
                                </p>
                            </div>

                        </div>


                        <div className="about-step">

                            <span>
                                04
                            </span>

                            <div>
                                <strong>
                                    Track
                                </strong>

                                <p>
                                    Follow order
                                    status from
                                    My Orders.
                                </p>
                            </div>

                        </div>

                    </div>

                </motion.div>


                {/* CTA */}

                <motion.div
                    className="about-cta"

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

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        View Products
                    </button>

                </motion.div>

            </div>

        </section>
    );
}