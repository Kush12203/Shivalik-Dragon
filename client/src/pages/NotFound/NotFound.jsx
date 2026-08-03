import {
    ArrowLeft,
    Home,
    SearchX
} from "lucide-react";

import {
    motion
} from "framer-motion";

import {
    useNavigate
} from "react-router-dom";

import "./notFound.css";

export default function NotFound() {
    const navigate =
        useNavigate();

    return (
        <section className="not-found-page">

            <div className="not-found-glow not-found-glow-one" />
            <div className="not-found-glow not-found-glow-two" />

            <motion.div
                className="not-found-card"
                initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.97
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                transition={{
                    duration: 0.45
                }}
            >

                <div className="not-found-icon">
                    <SearchX
                        size={34}
                    />
                </div>

                <span className="not-found-label">
                    PAGE NOT FOUND
                </span>

                <h1>
                    404
                </h1>

                <h2>
                    Looks like this page
                    <strong>
                        {" "}
                        wandered off.
                    </strong>
                </h2>

                <p>
                    The page you're looking for
                    doesn't exist or may have been
                    moved. You can return home or
                    continue browsing our products.
                </p>

                <div className="not-found-actions">

                    <button
                        type="button"
                        className="not-found-home"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        <Home
                            size={18}
                        />

                        Back to Home
                    </button>

                    <button
                        type="button"
                        className="not-found-products"
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Browse Products

                        <ArrowLeft
                            size={17}
                            className="not-found-arrow"
                        />
                    </button>

                </div>

            </motion.div>

        </section>
    );
}