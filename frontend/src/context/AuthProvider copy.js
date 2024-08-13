import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({});


/*import React, { createContext, useState, useEffect } from 'react';

export const TOKEN = {
    token: ''
};

const AuthContext = createContext({});
const initialState = JSON.parse(localStorage.getItem("token")) || TOKEN;

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(initialState);

    useEffect(() => {
        if (localStorage.getItem('token'))
            setToken(localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    return (
        <AuthContext.Provider value={[token, setToken]}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, AuthContext };*/