import React from "react";
import ReactDOM from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";

import {
    CartProvider
} from "./context/CartContext";

import {
    GoogleOAuthProvider
} from "@react-oauth/google";

import {
    Toaster
} from "react-hot-toast";

import App from "./App";

import {
    AuthProvider
} from "./context/AuthContext";

import "./styles/globals.css";

const googleClientId =
    import.meta.env
        .VITE_GOOGLE_CLIENT_ID;

ReactDOM
    .createRoot(
        document.getElementById(
            "root"
        )
    )
    .render(
        <React.StrictMode>
            <GoogleOAuthProvider
                clientId={
                    googleClientId
                }
            >
                <BrowserRouter>
                    <AuthProvider>
    <CartProvider>
        <App />
     <Toaster
    position="top-center"
    gutter={12}
    containerStyle={{
        top: "24px"
    }}
/>
        {/* <Toaster
            position="top-right"
            toastOptions={{
                duration: 3500,

                style: {
                    borderRadius:
                        "14px",

                    background:
                        "#102018",

                    color:
                        "#ffffff"
                }
            }}
        /> */}
    </CartProvider>
</AuthProvider>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );