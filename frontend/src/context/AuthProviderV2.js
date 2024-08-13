import React, { createContext, useState, useEffect } from 'react';

export const TOKEN = {
    token: ''
};

const AuthContext = createContext({});
const initialState = JSON.parse(localStorage.getItem("token")) || TOKEN;

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(initialState);

    useEffect(() => {
        console.error(JSON.stringify(token));
        localStorage.setItem("token", JSON.stringify(token));
    }, [token]);

    return (
        <AuthContext.Provider value={[token, setToken]}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, AuthContext };