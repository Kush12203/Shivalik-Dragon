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

import {
    useAuth
} from "./context/AuthContext";

// =========================
// PROTECTED ROUTE
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
            <Route
                element={
                    <MainLayout />
                }
            >
                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />

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
<Route
    path="/products"
    element={
        <Products />
    }
/>

<Route
    path="/cart"
    element={
        <Cart />
    }
/>

<Route
    path="/checkout"
    element={
        <ProtectedRoute>
            <Checkout />
        </ProtectedRoute>
    }
/>
<Route
    path="/orders"
    element={
        <ProtectedRoute>
            <Orders />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin"
    element={
        <AdminRoute>
            <Admin />
        </AdminRoute>
    }
/>
 <Route
    path="/admin/products"
    element={
        <AdminRoute>
            <AdminProducts />
        </AdminRoute>
    }
/> 
<Route
    path="/admin/users"
    element={
        <AdminRoute>
            <AdminUsers />
        </AdminRoute>
    }
/>
{/* <Route
    path="/about"
    element={
        <About />
    }
/> */}
<Route
    path="/location"
    element={
        <Location />
    }
/>
<Route
    path="/contact"
    element={
        <Contact />
    }
/>
<Route
    path="/admin/enquiries"
    element={
        <AdminRoute>
            <AdminEnquiries />
        </AdminRoute>
    }
/>
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />
            </Route>
            
            
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