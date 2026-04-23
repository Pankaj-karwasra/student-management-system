import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

/**
 * Safely retrieves the user object and token from localStorage.
 */
const getInitialAuthState = () => {
    try {
        const userStr = localStorage.getItem('user');
        const tokenStr = localStorage.getItem('token'); // Get token
        return {
            user: userStr ? JSON.parse(userStr) : null,
            token: tokenStr || null, // Initialize token
        };
    } catch (error) {
        console.error("Could not parse auth data from localStorage", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Clean up
        return { user: null, token: null };
    }
};

const useAuthStore = create((set, get) => ({
    ...getInitialAuthState(), // Initialize with user and token
    
    loading: false,

    /**
     * Sets the user object and token in the store and persists them to localStorage.
     */
    setAuth: (userData, tokenData) => {
        set({ user: userData, token: tokenData });
        if (userData && tokenData) {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', tokenData); // Store token
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // Clear token on logout
        }
    },

    setLoading: (loading) => set({ loading }),

    isLoggedIn: () => !!get().user && !!get().token, // Check both user and token

    /**
     * Clears all authentication data.
     */
    logout: () => {
        get().setAuth(null, null); // Clear user and token
        // Also ensure cookies are cleared if they were used for token storage
        // This will be handled by the logout in utilis/auth.js as well
    }
}));

if (import.meta.env.DEV) {
    mountStoreDevtool("AuthStore", useAuthStore);
}

export { useAuthStore };