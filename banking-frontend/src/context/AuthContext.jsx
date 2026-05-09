import { useState } from "react";
import { AuthContext } from "./auth-context";

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) =>
                    "%" +
                    ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() =>
        localStorage.getItem("token")
    );
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        const parsedUser = storedToken ? parseJwt(storedToken) : null;

        if (storedToken && !parsedUser) {
            localStorage.removeItem("token");
            return null;
        }

        return parsedUser;
    });

    const login = (tokenPayload) => {
        const nextToken =
            typeof tokenPayload === "string"
                ? tokenPayload
                : tokenPayload?.token;

        if (!nextToken) {
            return;
        }

        localStorage.setItem("token", nextToken);
        setToken(nextToken);
        setUser(parseJwt(nextToken));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}