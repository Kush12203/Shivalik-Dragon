import {
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";


import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";

import Login from "./pages/Login/Login";

import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import Products from "./pages/Products/Products";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./pages/Orders/Orders";
import Admin from "./pages/Admin/Admin";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
// import About from "./pages/About/About";
import Location from "./pages/Location/Location";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import AdminEnquiries from "./pages/AdminEnquiries/AdminEnquiries";
import Gallery from "./pages/Gallery/Gallery";
import AdminGallery from "./pages/AdminGallery/AdminGallery";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import AdminCustomers from "./pages/AdminCustomers/AdminCustomers";
import CustomerProfile from "./pages/CustomerProfile/CustomerProfile";

import {
    useAuth
} from "./context/AuthContext";


// =========================
// ADMIN ROUTE
// =========================

function AdminRoute({
    children
}) {
    const {
        user
    } = useAuth();

    if (
        !user ||
        ![
            "admin",
            "superadmin"
        ].includes(
            user.role
        )
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}


// =========================
// PROTECTED ROUTE
// =========================

function ProtectedRoute({
    children
}) {
    const {
        user
    } = useAuth();

    const location =
        useLocation();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname
                }}
            />
        );
    }

    return children;
}


// =========================
// APP
// =========================

function App() {
    const {
        user,
        authLoading
    } = useAuth();


    if (authLoading) {
        return (
            <div className="app-loader">

                <div className="app-loader-ring" />

                <p>
                    Loading Shivalik Dragon...
                </p>

            </div>
        );
    }


    return (
        <Routes>

            {/* =========================
                MAIN LAYOUT
            ========================= */}

            <Route
                element={
                    <MainLayout />
                }
            >

                {/* =========================
                    HOME
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        ) : (
                            <Login />
                        )
                    }
                />


                {/* =========================
                    REGISTER
                ========================= */}

                <Route
                    path="/register"
                    element={
                        user ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        ) : (
                            <Register />
                        )
                    }
                />


                {/* =========================
                    FORGOT PASSWORD
                ========================= */}

                <Route
                    path="/forgot-password"
                    element={
                        user ? (
                            <Navigate
                                to="/"
                                replace
                            />
                        ) : (
                            <ForgotPassword />
                        )
                    }
                />


                {/* =========================
                    PRODUCTS
                ========================= */}

                <Route
                    path="/products"
                    element={
                        <Products />
                    }
                />


                {/* =========================
                    CART
                ========================= */}

                <Route
                    path="/cart"
                    element={
                        <Cart />
                    }
                />


                {/* =========================
                    CHECKOUT
                ========================= */}

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    ORDERS
                ========================= */}

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    ACCOUNT
                ========================= */}

                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    LOCATION
                ========================= */}

                <Route
                    path="/location"
                    element={
                        <Location />
                    }
                />


                {/* =========================
                    CONTACT
                ========================= */}

                <Route
                    path="/contact"
                    element={
                        <Contact />
                    }
                />


                {/* =========================
                    GALLERY
                ========================= */}

                <Route
                    path="/gallery"
                    element={
                        <Gallery />
                    }
                />


                {/* =========================
                    ADMIN ORDERS
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ADMIN PRODUCTS
                ========================= */}

                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <AdminProducts />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ADMIN USERS
                ========================= */}

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ADMIN ENQUIRIES
                ========================= */}

                <Route
                    path="/admin/enquiries"
                    element={
                        <AdminRoute>
                            <AdminEnquiries />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ADMIN GALLERY
                ========================= */}

                <Route
                    path="/admin/gallery"
                    element={
                        <AdminRoute>
                            <AdminGallery />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ADMIN CUSTOMERS
                ========================= */}

                <Route
                    path="/admin/customers"
                    element={
                        <AdminRoute>
                            <AdminCustomers />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    CUSTOMER PROFILE
                ========================= */}

                <Route
                    path="/admin/customers/:id"
                    element={
                        <AdminRoute>
                            <CustomerProfile />
                        </AdminRoute>
                    }
                />


                {/* =========================
                    ABOUT
                ========================= */}

                {/*
                <Route
                    path="/about"
                    element={
                        <About />
                    }
                />
                */}

            </Route>


            {/* =========================
                404
            ========================= */}

            <Route
                path="*"
                element={
                    <NotFound />
                }
            />

        </Routes>
    );
}


export default App;