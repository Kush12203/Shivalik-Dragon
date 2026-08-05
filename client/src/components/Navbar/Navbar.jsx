import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    AnimatePresence,
    motion
} from "framer-motion";

import {
    ChevronDown,
    Images,
    LogIn,
    LogOut,
    Mail,
    Menu,
    PackagePlus,
    ShoppingBag,
    User,
    UsersRound,
    X
} from "lucide-react";

import {
    useAuth
} from "../../context/AuthContext";

import {
    useCart
} from "../../context/CartContext";

import "./navbar.css";


export default function Navbar() {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        user,
        logout
    } = useAuth();

    const {
        itemCount
    } = useCart();


    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);

    const [
        accountOpen,
        setAccountOpen
    ] = useState(false);


    const accountRef =
        useRef(null);


    const isAdmin =
        user &&
        [
            "admin",
            "superadmin"
        ].includes(
            user.role
        );


    const displayName =
        user?.fullName ||
        user?.username ||
        "Account";


    // =========================
    // CLOSE ACCOUNT MENU
    // WHEN CLICKING OUTSIDE
    // =========================

    useEffect(
        () => {
            const handleOutside =
                event => {
                    if (
                        accountRef.current &&
                        !accountRef.current.contains(
                            event.target
                        )
                    ) {
                        setAccountOpen(
                            false
                        );
                    }
                };


            document.addEventListener(
                "mousedown",
                handleOutside
            );


            return () => {
                document.removeEventListener(
                    "mousedown",
                    handleOutside
                );
            };
        },
        []
    );


    // =========================
    // CLOSE MENUS ON ROUTE CHANGE
    // =========================

    useEffect(
        () => {
            setMenuOpen(
                false
            );

            setAccountOpen(
                false
            );
        },
        [
            location.pathname
        ]
    );


    // =========================
    // DESKTOP RESIZE
    // =========================

    useEffect(
        () => {
            const handleResize =
                () => {
                    if (
                        window.innerWidth >
                        900
                    ) {
                        setMenuOpen(
                            false
                        );
                    }
                };


            window.addEventListener(
                "resize",
                handleResize
            );


            return () => {
                window.removeEventListener(
                    "resize",
                    handleResize
                );
            };
        },
        []
    );


    // =========================
    // BODY SCROLL LOCK
    // =========================

    useEffect(
        () => {
            document.body.style.overflow =
                menuOpen
                    ? "hidden"
                    : "";


            return () => {
                document.body.style.overflow =
                    "";
            };
        },
        [
            menuOpen
        ]
    );


    // =========================
    // NAVIGATE
    // =========================

    const goTo =
        path => {
            setMenuOpen(
                false
            );

            setAccountOpen(
                false
            );

            navigate(
                path
            );
        };


    // =========================
    // ABOUT
    // =========================

    const handleAboutClick =
        () => {
            setMenuOpen(
                false
            );

            setAccountOpen(
                false
            );


            const scrollToAbout =
                () => {
                    const section =
                        document.getElementById(
                            "about"
                        );


                    if (section) {
                        section.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });
                    }
                };


            if (
                location.pathname ===
                "/"
            ) {
                scrollToAbout();

                return;
            }


            navigate(
                "/"
            );


            setTimeout(
                scrollToAbout,
                220
            );
        };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout =
        async () => {
            try {
                await logout();
            } catch (error) {
                console.error(
                    "Logout error:",
                    error
                );
            } finally {
                setMenuOpen(
                    false
                );

                setAccountOpen(
                    false
                );

                navigate(
                    "/"
                );
            }
        };


    return (
        <>
            <motion.header
                className="navbar"
                initial={{
                    opacity: 0,
                    y: -12
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut"
                }}
            >
                <div className="navbar-glow navbar-glow-left" />

                <div className="navbar-glow navbar-glow-right" />


                <div className="navbar-inner">

                    {/* =========================
                        BRAND
                    ========================= */}

                    <Link
                        to="/"
                        className="brand"
                        onClick={() => {
                            setMenuOpen(
                                false
                            );

                            setAccountOpen(
                                false
                            );
                        }}
                    >
                        <div className="brand-mark">
                            <span />
                        </div>


                        <div className="brand-text">
                            <div className="brand-title">
                                <span className="brand-shivalik">
                                    Shivalik
                                </span>

                                <span className="brand-dragon">
                                    Dragon
                                </span>
                            </div>

                            <span className="brand-tagline">
                                Fresh. Direct. Trusted.
                            </span>
                        </div>
                    </Link>


                    {/* =========================
                        DESKTOP NAVIGATION
                    ========================= */}

                    <nav className="desktop-nav">

                        <NavLink
                            to="/"
                            end
                            className={({
                                isActive
                            }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/products"
                            className={({
                                isActive
                            }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            Products
                        </NavLink>


                        <button
                            type="button"
                            className="nav-link navbar-about-link"
                            onClick={
                                handleAboutClick
                            }
                        >
                            About
                        </button>


                        <NavLink
                            to="/location"
                            className={({
                                isActive
                            }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            Location
                        </NavLink>


                        <NavLink
                            to="/contact"
                            className={({
                                isActive
                            }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            Contact
                        </NavLink>
                        <NavLink
    to="/gallery"
    className={({
        isActive
    }) =>
        isActive
            ? "nav-link active"
            : "nav-link"
    }
>
    Gallery
</NavLink>
                    </nav>


                    {/* =========================
                        RIGHT SIDE
                    ========================= */}

                    <div className="navbar-actions">

                        {/* =========================
                            CART
                        ========================= */}

                        <button
                            type="button"
                            className="navbar-cart-button"
                            onClick={() =>
                                goTo(
                                    "/cart"
                                )
                            }
                            aria-label="Open cart"
                        >
                            <ShoppingBag
                                size={19}
                            />


                            {itemCount >
                                0 && (
                                <span className="cart-count">
                                    {itemCount >
                                    99
                                        ? "99+"
                                        : itemCount}
                                </span>
                            )}

                        </button>


                        {/* =========================
                            NOT LOGGED IN
                        ========================= */}

                        {!user && (
                            <button
                                type="button"
                                className="signin-button"
                                onClick={() =>
                                    goTo(
                                        "/login"
                                    )
                                }
                            >
                                <LogIn
                                    size={18}
                                />

                                Sign In
                            </button>
                        )}


                        {/* =========================
                            LOGGED IN
                        ========================= */}

                        {user && (
                            <div
                                className="account-wrapper"
                                ref={
                                    accountRef
                                }
                            >
                                <button
                                    type="button"
                                    className="account-button"
                                    onClick={() =>
                                        setAccountOpen(
                                            current =>
                                                !current
                                        )
                                    }
                                >
                                    <div className="navbar-avatar">

                                        {user.avatar ? (
                                            <img
                                                src={
                                                    user.avatar
                                                }
                                                alt={
                                                    displayName
                                                }
                                            />
                                        ) : (
                                            <User
                                                size={18}
                                            />
                                        )}

                                    </div>


                                    <span className="account-name">
                                        {
                                            displayName
                                        }
                                    </span>


                                    <motion.span
                                        className="account-chevron"
                                        animate={{
                                            rotate:
                                                accountOpen
                                                    ? 180
                                                    : 0
                                        }}
                                        transition={{
                                            duration:
                                                0.18
                                        }}
                                    >
                                        <ChevronDown
                                            size={15}
                                        />
                                    </motion.span>

                                </button>


                                {/* =========================
                                    ACCOUNT DROPDOWN
                                ========================= */}

                                <AnimatePresence>

                                    {accountOpen && (
                                        <motion.div
                                            className="account-menu"
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                                scale:
                                                    0.97
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -8,
                                                scale:
                                                    0.97
                                            }}
                                            transition={{
                                                duration:
                                                    0.16
                                            }}
                                        >

                                            {/* ACCOUNT */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    goTo(
                                                        "/account"
                                                    )
                                                }
                                            >
                                                <User
                                                    size={18}
                                                />

                                                My Account
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    goTo(
                                                        "/orders"
                                                    )
                                                }
                                            >
                                                <ShoppingBag
                                                    size={18}
                                                />

                                                My Orders
                                            </button>


                                            {/* =========================
                                                ADMIN
                                            ========================= */}

                                            {isAdmin && (
                                                <>
                                                    <div className="account-menu-divider" />


                                                    <span className="account-menu-title">
                                                        ADMIN
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                "/admin"
                                                            )
                                                        }
                                                    >
                                                        <ShoppingBag
                                                            size={18}
                                                        />

                                                        Manage Orders
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                "/admin/products"
                                                            )
                                                        }
                                                    >
                                                        <PackagePlus
                                                            size={18}
                                                        />

                                                        Manage Products
                                                    </button>
                                                    <button
    type="button"

    onClick={() =>
        goTo(
            "/admin/customers"
        )
    }
>
    <UsersRound
        size={18}
    />

    Customers
</button>
                                                    <button
    type="button"
    onClick={() =>
        goTo(
            "/admin/gallery"
        )
    }
>
    <Images
        size={18}
    />

    Manage Gallery
</button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                "/admin/users"
                                                            )
                                                        }
                                                    >
                                                        <UsersRound
                                                            size={18}
                                                        />

                                                        Manage Users
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                "/admin/enquiries"
                                                            )
                                                        }
                                                    >
                                                        <Mail
                                                            size={18}
                                                        />

                                                        Enquiries
                                                    </button>
                                                </>
                                            )}


                                            <div className="account-menu-divider" />


                                            {/* =========================
                                                LOGOUT
                                            ========================= */}

                                            <button
                                                type="button"
                                                className="logout-item"
                                                onClick={
                                                    handleLogout
                                                }
                                            >
                                                <LogOut
                                                    size={18}
                                                />

                                                Logout
                                            </button>

                                        </motion.div>
                                    )}

                                </AnimatePresence>

                            </div>
                        )}


                        {/* =========================
                            MOBILE MENU BUTTON
                        ========================= */}

                        <button
                            type="button"
                            className="mobile-menu-button"
                            onClick={() =>
                                setMenuOpen(
                                    true
                                )
                            }
                            aria-label="Open navigation"
                        >
                            <Menu
                                size={22}
                            />
                        </button>

                    </div>

                </div>

            </motion.header>


            {/* =========================================================
                MOBILE DRAWER
            ========================================================= */}

            <AnimatePresence>

                {menuOpen && (
                    <>
                        <motion.div
                            className="mobile-overlay"
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
                                setMenuOpen(
                                    false
                                )
                            }
                        />


                        <motion.aside
                            className="mobile-drawer"
                            initial={{
                                x: "100%"
                            }}
                            animate={{
                                x: 0
                            }}
                            exit={{
                                x: "100%"
                            }}
                            transition={{
                                type:
                                    "spring",

                                stiffness:
                                    260,

                                damping:
                                    28
                            }}
                        >

                            {/* =========================
                                MOBILE HEADER
                            ========================= */}

                            <div className="mobile-drawer-header">

                                <Link
                                    to="/"
                                    className="mobile-brand"
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    <div className="mobile-brand-mark">
                                        <span />
                                    </div>


                                    <div>
                                        <strong>
                                            Shivalik Dragon
                                        </strong>

                                        <span>
                                            Fresh. Direct. Trusted.
                                        </span>
                                    </div>
                                </Link>


                                <button
                                    type="button"
                                    className="mobile-close-button"
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    <X
                                        size={21}
                                    />
                                </button>

                            </div>


                            {/* =========================
                                MOBILE NAVIGATION
                            ========================= */}

                            <nav className="mobile-nav">

                                <NavLink
                                    to="/"
                                    end
                                    className={({
                                        isActive
                                    }) =>
                                        isActive
                                            ? "mobile-nav-link active"
                                            : "mobile-nav-link"
                                    }
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    Home
                                </NavLink>


                                <NavLink
                                    to="/products"
                                    className={({
                                        isActive
                                    }) =>
                                        isActive
                                            ? "mobile-nav-link active"
                                            : "mobile-nav-link"
                                    }
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    Products
                                </NavLink>


                                <button
                                    type="button"
                                    className="mobile-nav-link mobile-about-link"
                                    onClick={
                                        handleAboutClick
                                    }
                                >
                                    About
                                </button>


                                <NavLink
                                    to="/location"
                                    className={({
                                        isActive
                                    }) =>
                                        isActive
                                            ? "mobile-nav-link active"
                                            : "mobile-nav-link"
                                    }
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    Location
                                </NavLink>


                                <NavLink
                                    to="/contact"
                                    className={({
                                        isActive
                                    }) =>
                                        isActive
                                            ? "mobile-nav-link active"
                                            : "mobile-nav-link"
                                    }
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    Contact
                                </NavLink>
 <NavLink
    to="/gallery"
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Gallery
</NavLink>

                                <NavLink
                                    to="/cart"
                                    className={({
                                        isActive
                                    }) =>
                                        isActive
                                            ? "mobile-nav-link active"
                                            : "mobile-nav-link"
                                    }
                                    onClick={() =>
                                        setMenuOpen(
                                            false
                                        )
                                    }
                                >
                                    Cart


                                    {itemCount >
                                        0 && (
                                        <span className="mobile-cart-count">
                                            {
                                                itemCount
                                            }
                                        </span>
                                    )}

                                </NavLink>


                                {/* =========================
                                    LOGGED IN MOBILE
                                ========================= */}

                                {user ? (
                                    <>
                                        <div className="mobile-nav-divider" />


                                        <div className="mobile-user-card">

                                            <div className="mobile-user-avatar">

                                                {user.avatar ? (
                                                    <img
                                                        src={
                                                            user.avatar
                                                        }
                                                        alt={
                                                            displayName
                                                        }
                                                    />
                                                ) : (
                                                    <User
                                                        size={19}
                                                    />
                                                )}

                                            </div>


                                            <div>
                                                <strong>
                                                    {
                                                        displayName
                                                    }
                                                </strong>

                                                <span>
                                                    {user.email ||
                                                        user.role}
                                                </span>
                                            </div>

                                        </div>


                                        <NavLink
                                            to="/account"
                                            className="mobile-nav-link"
                                            onClick={() =>
                                                setMenuOpen(
                                                    false
                                                )
                                            }
                                        >
                                            My Account
                                        </NavLink>


                                        <NavLink
                                            to="/orders"
                                            className="mobile-nav-link"
                                            onClick={() =>
                                                setMenuOpen(
                                                    false
                                                )
                                            }
                                        >
                                            My Orders
                                        </NavLink>


                                        {/* =========================
                                            MOBILE ADMIN
                                        ========================= */}

                                        {isAdmin && (
                                            <>
                                                <div className="mobile-nav-divider" />


                                                <span className="mobile-admin-title">
                                                    ADMIN
                                                </span>


                                               <NavLink
    to="/admin"
    end
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Manage Orders
</NavLink>


                                              <NavLink
    to="/admin/products"
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Manage Products
</NavLink>

<NavLink
    to="/admin/customers"

    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }

    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Customers
</NavLink>

<NavLink
    to="/admin/gallery"
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Manage Gallery
</NavLink>

<NavLink
    to="/admin/users"
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Manage Users
</NavLink>

<NavLink
    to="/admin/enquiries"
    className={({
        isActive
    }) =>
        isActive
            ? "mobile-nav-link active"
            : "mobile-nav-link"
    }
    onClick={() =>
        setMenuOpen(
            false
        )
    }
>
    Enquiries
</NavLink>
                                            </>
                                        )}


                                        {/* =========================
                                            MOBILE LOGOUT
                                        ========================= */}

                                        <button
                                            type="button"
                                            className="mobile-logout"
                                            onClick={
                                                handleLogout
                                            }
                                        >
                                            <LogOut
                                                size={17}
                                            />

                                            Logout
                                        </button>

                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="mobile-signin"
                                        onClick={() =>
                                            goTo(
                                                "/login"
                                            )
                                        }
                                    >
                                        <LogIn
                                            size={18}
                                        />

                                        Sign In
                                    </button>
                                )}

                            </nav>

                        </motion.aside>
                    </>
                )}

            </AnimatePresence>
        </>
    );
}