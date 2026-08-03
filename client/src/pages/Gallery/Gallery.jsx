import {
    ChevronLeft,
    ChevronRight,
    Expand,
    ImageIcon,
    Sparkles,
    X
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    AnimatePresence,
    motion
} from "framer-motion";

import {
    getGalleryImages
} from "../../services/galleryService";

import {
    errorToast
} from "../../utils/showToast";

import "./gallery.css";


const categories = [
    "All",
    "Farm",
    "Dragon Fruit",
    "Harvest",
    "Flowers",
    "Behind the Scenes",
    "Other"
];


export default function Gallery() {
    const [
        images,
        setImages
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        activeCategory,
        setActiveCategory
    ] = useState("All");

    const [
        selectedIndex,
        setSelectedIndex
    ] = useState(null);


    const loadGallery =
        async () => {
            try {
                setLoading(
                    true
                );

                const params =
                    activeCategory ===
                    "All"
                        ? {}
                        : {
                              category:
                                  activeCategory
                          };

                const response =
                    await getGalleryImages(
                        params
                    );

                setImages(
                    response.data
                        .images ||
                    []
                );

            } catch (error) {
                console.error(
                    "Load gallery error:",
                    error
                );

                errorToast(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load gallery."
                );

            } finally {
                setLoading(
                    false
                );
            }
        };


    useEffect(
        () => {
            loadGallery();
        },
        [
            activeCategory
        ]
    );


    useEffect(
        () => {
            if (
                selectedIndex ===
                null
            ) {
                document.body.style.overflow =
                    "";

                return;
            }

            document.body.style.overflow =
                "hidden";


            const handleKey =
                event => {
                    if (
                        event.key ===
                        "Escape"
                    ) {
                        setSelectedIndex(
                            null
                        );
                    }

                    if (
                        event.key ===
                        "ArrowRight"
                    ) {
                        showNext();
                    }

                    if (
                        event.key ===
                        "ArrowLeft"
                    ) {
                        showPrevious();
                    }
                };


            window.addEventListener(
                "keydown",
                handleKey
            );


            return () => {
                document.body.style.overflow =
                    "";

                window.removeEventListener(
                    "keydown",
                    handleKey
                );
            };
        },
        [
            selectedIndex,
            images.length
        ]
    );


    const selectedImage =
        selectedIndex !==
        null
            ? images[
                  selectedIndex
              ]
            : null;


    const availableCategories =
        useMemo(
            () => {
                const present =
                    new Set(
                        images.map(
                            image =>
                                image.category
                        )
                    );

                if (
                    activeCategory !==
                    "All"
                ) {
                    present.add(
                        activeCategory
                    );
                }

                return categories.filter(
                    category =>
                        category ===
                            "All" ||
                        present.has(
                            category
                        )
                );
            },
            [
                images,
                activeCategory
            ]
        );


    const showNext =
        () => {
            if (
                images.length ===
                0 ||
                selectedIndex ===
                null
            ) {
                return;
            }

            setSelectedIndex(
                current =>
                    current ===
                    images.length -
                        1
                        ? 0
                        : current +
                          1
            );
        };


    const showPrevious =
        () => {
            if (
                images.length ===
                0 ||
                selectedIndex ===
                null
            ) {
                return;
            }

            setSelectedIndex(
                current =>
                    current ===
                    0
                        ? images.length -
                          1
                        : current -
                          1
            );
        };


    return (
        <section className="gallery-page">

            <div className="gallery-glow gallery-glow-left" />
            <div className="gallery-glow gallery-glow-right" />


            <div className="gallery-container">

                {/* =========================
                    HERO
                ========================= */}

                <motion.div
                    className="gallery-hero"

                    initial={{
                        opacity: 0,
                        y: 22
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    transition={{
                        duration: 0.5,
                        ease: "easeOut"
                    }}
                >

                    <div className="gallery-badge">
                        <Sparkles
                            size={15}
                        />

                        OUR FARM
                    </div>


                    <h1>
                        Moments from
                        <span>
                            {" "}
                            Shivalik.
                        </span>
                    </h1>


                    <p>
                        A glimpse into the farm,
                        fresh harvests, Dragon Fruit,
                        flowers and everyday moments
                        from Shivalik Dragon.
                    </p>

                </motion.div>


                {/* =========================
                    CATEGORY FILTER
                ========================= */}

                <div className="gallery-filter">

                    {categories.map(
                        category => (
                            <button
                                key={
                                    category
                                }
                                type="button"

                                className={
                                    activeCategory ===
                                    category
                                        ? "gallery-filter-button active"
                                        : "gallery-filter-button"
                                }

                                onClick={() =>
                                    setActiveCategory(
                                        category
                                    )
                                }
                            >
                                {
                                    category
                                }
                            </button>
                        )
                    )}

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (
                    <div className="gallery-loading">

                        <div className="gallery-loader" />

                        <span>
                            Loading moments...
                        </span>

                    </div>
                )}


                {/* =========================
                    EMPTY
                ========================= */}

                {!loading &&
                    images.length ===
                        0 && (
                    <div className="gallery-empty">

                        <div className="gallery-empty-icon">
                            <ImageIcon
                                size={30}
                            />
                        </div>

                        <h3>
                            Gallery coming soon.
                        </h3>

                        <p>
                            Fresh farm moments
                            will appear here
                            once they are added.
                        </p>

                    </div>
                )}


                {/* =========================
                    GALLERY GRID
                ========================= */}

                {!loading &&
                    images.length >
                        0 && (

                    <motion.div
                        className="gallery-grid"
                        layout
                    >

                        {images.map(
                            (
                                image,
                                index
                            ) => (

                                <motion.article
                                    key={
                                        image._id
                                    }

                                    className={`gallery-card ${
                                        image.isFeatured
                                            ? "gallery-card-featured"
                                            : ""
                                    }`}

                                    initial={{
                                        opacity:
                                            0,

                                        y:
                                            24
                                    }}

                                    animate={{
                                        opacity:
                                            1,

                                        y:
                                            0
                                    }}

                                    transition={{
                                        delay:
                                            index *
                                            0.04
                                    }}

                                    layout
                                >

                                    <button
                                        type="button"
                                        className="gallery-image-button"

                                        onClick={() =>
                                            setSelectedIndex(
                                                index
                                            )
                                        }
                                    >

                                        <img
                                            src={
                                                image.imageUrl
                                            }

                                            alt={
                                                image.title ||
                                                "Shivalik Dragon gallery"
                                            }
                                        />


                                        <div className="gallery-card-overlay">

                                            <div className="gallery-card-overlay-top">

                                                <span className="gallery-category-chip">
                                                    {
                                                        image.category
                                                    }
                                                </span>


                                                <div className="gallery-expand-icon">
                                                    <Expand
                                                        size={17}
                                                    />
                                                </div>

                                            </div>


                                            <div className="gallery-card-copy">

                                                {image.title && (
                                                    <h3>
                                                        {
                                                            image.title
                                                        }
                                                    </h3>
                                                )}


                                                {image.caption && (
                                                    <p>
                                                        {
                                                            image.caption
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                    </button>

                                </motion.article>

                            )
                        )}

                    </motion.div>
                )}

            </div>


            {/* =========================
                LIGHTBOX
            ========================= */}

            <AnimatePresence>

                {selectedImage && (

                    <motion.div
                        className="gallery-lightbox"

                        initial={{
                            opacity: 0
                        }}

                        animate={{
                            opacity: 1
                        }}

                        exit={{
                            opacity: 0
                        }}

                        onClick={() =>
                            setSelectedIndex(
                                null
                            )
                        }
                    >

                        <motion.div
                            className="gallery-lightbox-inner"

                            initial={{
                                opacity: 0,
                                scale:
                                    0.96,
                                y:
                                    20
                            }}

                            animate={{
                                opacity: 1,
                                scale:
                                    1,
                                y:
                                    0
                            }}

                            exit={{
                                opacity: 0,
                                scale:
                                    0.96
                            }}

                            transition={{
                                duration:
                                    0.22
                            }}

                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <button
                                type="button"
                                className="gallery-lightbox-close"

                                onClick={() =>
                                    setSelectedIndex(
                                        null
                                    )
                                }

                                aria-label="Close image"
                            >
                                <X
                                    size={21}
                                />
                            </button>


                            {images.length >
                                1 && (
                                <>
                                    <button
                                        type="button"
                                        className="gallery-lightbox-nav gallery-lightbox-prev"

                                        onClick={
                                            showPrevious
                                        }

                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft
                                            size={24}
                                        />
                                    </button>


                                    <button
                                        type="button"
                                        className="gallery-lightbox-nav gallery-lightbox-next"

                                        onClick={
                                            showNext
                                        }

                                        aria-label="Next image"
                                    >
                                        <ChevronRight
                                            size={24}
                                        />
                                    </button>
                                </>
                            )}


                            <div className="gallery-lightbox-image-wrap">

                                <img
                                    src={
                                        selectedImage.imageUrl
                                    }

                                    alt={
                                        selectedImage.title ||
                                        "Shivalik Dragon gallery"
                                    }
                                />

                            </div>


                            {(selectedImage.title ||
                                selectedImage.caption) && (

                                <div className="gallery-lightbox-copy">

                                    <span>
                                        {
                                            selectedImage.category
                                        }
                                    </span>


                                    {selectedImage.title && (
                                        <h2>
                                            {
                                                selectedImage.title
                                            }
                                        </h2>
                                    )}


                                    {selectedImage.caption && (
                                        <p>
                                            {
                                                selectedImage.caption
                                            }
                                        </p>
                                    )}

                                </div>

                            )}

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </section>
    );
}