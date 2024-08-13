import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    userName: '',
    setUserName: () => { alert(1) },
});

export function AuthProvider({ children }) {
    const [userName, setUserName] = useState('John Smith');

    return (
        <AuthContext.Provider value={userName}>
            {children}
        </AuthContext.Provider>
    );
}