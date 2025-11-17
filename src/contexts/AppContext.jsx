import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const parsed = savedUser ? JSON.parse(savedUser) : null;
            if (accessToken || refreshToken) {
                const base = parsed || {};
                base.tokens = base.tokens || {};
                if (accessToken) base.tokens.accessToken = accessToken;
                if (refreshToken) base.tokens.refreshToken = refreshToken;
                return base;
            }
            return parsed;
        } catch {
            return null;
        }
    });

    // keep user in localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // login function
    // Accepts either a full user object or a tokens object { accessToken, refreshToken }.
    // If tokens are provided we merge them into the existing user state so ApiContext
    // can read tokens from `user.tokens`.
    const login = (payload) => {
        if (!payload) return;
        // payload looks like tokens
        const isTokens = payload && (payload.accessToken || payload.refreshToken || (payload.tokens && (payload.tokens.accessToken || payload.tokens.refreshToken)));
        if (isTokens && (typeof payload !== 'object' || !payload.id)) {
            const tokens = payload.tokens ? payload.tokens : { accessToken: payload.accessToken, refreshToken: payload.refreshToken };
            setUser((prev) => ({ ...(prev || {}), tokens }));
            try {
                if (tokens?.accessToken) localStorage.setItem('accessToken', tokens.accessToken);
                if (tokens?.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken);
            } catch (err) { console.error(err) }
            return;
        }

        // payload is a full user object
        setUser(payload);
        try {
            if (payload?.tokens?.accessToken) localStorage.setItem('accessToken', payload.tokens.accessToken);
            if (payload?.tokens?.refreshToken) localStorage.setItem('refreshToken', payload.tokens.refreshToken);
        } catch (err) { console.error(err) }
    };

    // logout function
    const logout = () => {
        setUser(null);
        try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            } catch (err) { console.error(err) }
    };

    const provider = {
        user,
        login,
        logout,
        setUser,
    };

    return (
        <AppContext.Provider value={provider}>{children}</AppContext.Provider>
    );
};

const useAPP = () => useContext(AppContext);

export { AppProvider, useAPP };
