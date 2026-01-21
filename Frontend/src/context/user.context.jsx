import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axios';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(() => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u) : null;
        } catch (err) {
            return null;
        }
    });

    // on mount, if token exists but user is not loaded, fetch profile from backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            axios
                .get('/users/profile')
                .then((res) => {
                    if (res.data?.user) {
                        setUser(res.data.user);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                    }
                })
                .catch((err) => {
                    console.log('Failed to fetch profile:', err?.response?.data || err.message);
                });
        } else {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.log('Failed to parse stored user:', err);
            }
        }
    }, []);

    // keep localStorage in sync with context
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


