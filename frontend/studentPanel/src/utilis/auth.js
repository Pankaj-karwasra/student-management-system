import { useAuthStore } from "../store/auth.js";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; 
import Cookie from 'js-cookie';  
import { API_BASE_URL } from "./constants.js";





let globalNavigator = null;

export const setGlobalNavigator = (navigateFunction) => {
    globalNavigator = navigateFunction;
};


export const setAuthTokenCookie = (token) => {
    Cookie.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
};


export const login = async (email, password) => { 
    const authStore = useAuthStore.getState();
    authStore.setLoading(true);
    try {
        const { data, status } = await axios.post(`${API_BASE_URL}login/`, {
            email, // Use email
            password,
        });

        if (status === 200) {
            const { token, user } = data; 
            setAuthTokenCookie(token); 
            authStore.setAuth(user, token); 
        }
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response?.data?.message || "Login failed due to unexpected error.",
        };
    } finally {
        authStore.setLoading(false);
    }
};

export const register = async (userData) => {
    const { email, password, confirmPassword, username } = userData;
    const authStore = useAuthStore.getState();
    authStore.setLoading(true);
    try {
        const registrationResponse = await axios.post(`${API_BASE_URL}reg`, { 
            username,
            email,
            password,
        });

        if (registrationResponse.status === 201) {
            const { token, user } = registrationResponse.data;
            setAuthTokenCookie(token);
            authStore.setAuth(user, token);
            return { data: registrationResponse.data, error: null };
        }
        

    } catch (error) {
        let errorMessage = "Registration failed.";
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        return { data: null, error: errorMessage };
    } finally {
        authStore.setLoading(false);
    }
};

/**
 * Logs the user out by clearing tokens and user state.
 */
export const logout = () => {
    Cookie.remove('token'); // Clear cookie
    useAuthStore.getState().logout(); 
    
    
     // Use the stored global navigator for redirection
    if (globalNavigator) {
        globalNavigator('/login');
    } else {
        // Fallback for cases where globalNavigator might not be set (e.g., direct access, non-React context)
        window.location.href = '/login';
    }
};

/**
 * Checks if a JWT token is expired.
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp < Date.now() / 1000;
    } catch (e) {
        console.error("Error decoding token:", e);
        return true; // Malformed token is considered expired/invalid
    }
};

/**
 * **Note:** Your backend currently issues a single token with a fixed expiration (1h).
 * It does not appear to have a separate refresh token endpoint.
 * This `getRefreshedToken` function will be simplified to just log out if the token is expired,
 * as there's no backend mechanism to get a new one without re-logging in.
 * If you implement a refresh token on the backend, this function would need updating.
 */
export const getRefreshedToken = async () => {
    const currentToken = Cookie.get('token'); // Or from localStorage
    if (currentToken && !isTokenExpired(currentToken)) {
        return currentToken; // Token is still valid, no refresh needed or possible
    } else {
        // If expired and no refresh mechanism, then log out
        logout(); 
        throw new Error("Token expired and no refresh mechanism available. User logged out.");
    }
};