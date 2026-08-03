import {
    ArrowUpRight,
    MapPin,
    Navigation,
    ShieldCheck,
    Sparkles,
    Star
} from "lucide-react";

import {
    motion
} from "framer-motion";

import "./location.css";

export default function Location() {

    /*
        We will replace these with
        your actual Google Maps links.
    */

    const mapEmbedUrl =
        import.meta.env
            .VITE_GOOGLE_MAP_EMBED_URL;

    const googleMapsUrl =
        import.meta.env
            .VITE_GOOGLE_MAP_URL;

    const googleReviewUrl =
        import.meta.env
            .VITE_GOOGLE_REVIEW_URL;

    return (
        <section className="location-page">

            <div className="location-glow location-glow-one" />
            <div className="location-glow location-glow-two" />


            <div className="location-container">

                {/* =========================
                    HEADER
                ========================= */}

                <motion.div
                    className="location-header"

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

                    <div className="location-badge">

                        <MapPin
                            size={15}
                        />

                        VISIT SHIVALIK DRAGON

                    </div>


                    <h1>
                        Find us
                        <strong>
                            {" "}
                            on the map.
                        </strong>
                    </h1>


                    <p>
                        Visit Shivalik Dragon
                        Farm, get directions
                        directly through Google
                        Maps, or share your
                        experience with a Google
                        review.
                    </p>

                </motion.div>


                {/* =========================
                    MAIN GRID
                ========================= */}

                <div className="location-main-grid">


                    {/* =========================
                        MAP
                    ========================= */}

                    <motion.div
                        className="location-map-card"

                        initial={{
                            opacity: 0,
                            x: -20
                        }}

                        animate={{
                            opacity: 1,
                            x: 0
                        }}

                        transition={{
                            delay: 0.1
                        }}
                    >

                        <div className="location-map-header">

                            <div>

                                <span>
                                    OUR LOCATION
                                </span>

                                <h2>
                                    Shivalik Dragon
                                    Farm
                                </h2>

                            </div>


                            <div className="location-live-badge">

                                <span />

                                Google Maps

                            </div>

                        </div>


                        <div className="location-map">

                            {mapEmbedUrl ? (

                                <iframe
                                    src={
                                        mapEmbedUrl
                                    }
                                    title="Shivalik Dragon Farm Location"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />

                            ) : (

                                <div className="location-map-placeholder">

                                    <MapPin
                                        size={38}
                                    />

                                    <strong>
                                        Map will appear here
                                    </strong>

                                    <span>
                                        Add your Google Maps
                                        embed URL in the
                                        frontend .env file.
                                    </span>

                                </div>

                            )}

                        </div>

                    </motion.div>


                    {/* =========================
                        RIGHT INFO
                    ========================= */}

                    <motion.div
                        className="location-side"

                        initial={{
                            opacity: 0,
                            x: 20
                        }}

                        animate={{
                            opacity: 1,
                            x: 0
                        }}

                        transition={{
                            delay: 0.15
                        }}
                    >

                        {/* VISIT */}

                        <div className="location-info-card">

                            <div className="location-info-icon">

                                <MapPin
                                    size={20}
                                />

                            </div>


                            <span className="location-card-label">
                                VISIT THE FARM
                            </span>

                            <h2>
                                Shivalik Dragon
                                Farm
                            </h2>

                            <p>
                                Fresh Dragon Fruit
                                available directly
                                from our farm.
                            </p>


                            <button
                                className="location-primary-button"

                                disabled={
                                    !googleMapsUrl
                                }

                                onClick={() =>
                                    window.open(
                                        googleMapsUrl,
                                        "_blank",
                                        "noopener,noreferrer"
                                    )
                                }
                            >

                                <Navigation
                                    size={17}
                                />

                                Get Directions

                                <ArrowUpRight
                                    size={15}
                                />

                            </button>

                        </div>


                        {/* REVIEW */}

                        <div className="location-review-card">

                            <div className="review-stars">

                                <Star
                                    size={16}
                                    fill="currentColor"
                                />

                                <Star
                                    size={16}
                                    fill="currentColor"
                                />

                                <Star
                                    size={16}
                                    fill="currentColor"
                                />

                                <Star
                                    size={16}
                                    fill="currentColor"
                                />

                                <Star
                                    size={16}
                                    fill="currentColor"
                                />

                            </div>


                            <span>
                                YOUR EXPERIENCE
                            </span>

                            <h3>
                                Visited us?
                                <strong>
                                    {" "}
                                    Leave a review.
                                </strong>
                            </h3>

                            <p>
                                Your feedback helps
                                other customers discover
                                Shivalik Dragon.
                            </p>


                            <button
                                disabled={
                                    !googleReviewUrl
                                }

                                onClick={() =>
                                    window.open(
                                        googleReviewUrl,
                                        "_blank",
                                        "noopener,noreferrer"
                                    )
                                }
                            >

                                <Star
                                    size={16}
                                />

                                Review on Google

                                <ArrowUpRight
                                    size={15}
                                />

                            </button>

                        </div>

                    </motion.div>

                </div>


                {/* =========================
                    BOTTOM FEATURES
                ========================= */}

                <div className="location-features">

                    <motion.div
                        className="location-feature"

                        initial={{
                            opacity: 0,
                            y: 15
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true
                        }}
                    >

                        <Navigation
                            size={19}
                        />

                        <div>

                            <strong>
                                Easy Directions
                            </strong>

                            <span>
                                Open the exact farm
                                location in Google
                                Maps.
                            </span>

                        </div>

                    </motion.div>


                    <motion.div
                        className="location-feature"

                        initial={{
                            opacity: 0,
                            y: 15
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true
                        }}

                        transition={{
                            delay: 0.05
                        }}
                    >

                        <Sparkles
                            size={19}
                        />

                        <div>

                            <strong>
                                Fresh Direct
                            </strong>

                            <span>
                                Connect directly with
                                Shivalik Dragon Farm.
                            </span>

                        </div>

                    </motion.div>


                    <motion.div
                        className="location-feature"

                        initial={{
                            opacity: 0,
                            y: 15
                        }}

                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}

                        viewport={{
                            once: true
                        }}

                        transition={{
                            delay: 0.1
                        }}
                    >

                        <ShieldCheck
                            size={19}
                        />

                        <div>

                            <strong>
                                Trusted Location
                            </strong>

                            <span>
                                Directions are opened
                                directly through
                                Google Maps.
                            </span>

                        </div>

                    </motion.div>

                </div>

            </div>

        </section>
    );
}