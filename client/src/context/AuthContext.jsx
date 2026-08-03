import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext =
    createContext(null);

export const AuthProvider = ({
    children
}) => {
    const [
        user,
        setUser
    ] = useState(null);

    const [
        authLoading,
        setAuthLoading
    ] = useState(true);

    // =========================
    // CHECK SESSION
    // =========================

    const checkAuth =
        async () => {
            try {
                const response =
                    await api.get(
                        "/auth/me"
                    );

                setUser(
                    response.data.user
                );
            } catch {
                setUser(null);
            } finally {
                setAuthLoading(
                    false
                );
            }
        };

    useEffect(() => {
        checkAuth();
    }, []);

    // =========================
    // LOGIN
    // =========================

    const login =
        async (
            identifier,
            password
        ) => {
            const response =
                await api.post(
                    "/auth/login",
                    {
                        identifier,
                        password
                    }
                );

            setUser(
                response.data.user
            );

            return response.data;
        };

    // =========================
    // REGISTER
    // =========================

    const register =
        async (
            formData
        ) => {
            const response =
                await api.post(
                    "/auth/register",
                    formData
                );

            setUser(
                response.data.user
            );

            return response.data;
        };

    // =========================
    // GOOGLE LOGIN
    // =========================

    const googleLogin =
        async (
            credential
        ) => {
            const response =
                await api.post(
                    "/auth/google",
                    {
                        credential
                    }
                );

            setUser(
                response.data.user
            );

            return response.data;
        };

    // =========================
    // LOGOUT
    // =========================

    const logout =
        async () => {
            try {
                await api.post(
                    "/auth/logout"
                );
            } finally {
                setUser(null);
            }
        };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                authLoading,
                login,
                register,
                googleLogin,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(
        AuthContext
    );
};