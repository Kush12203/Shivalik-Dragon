import {
    Outlet
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export default function MainLayout() {
    return (
        <>
            <ScrollToTop />

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}