import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './constants';
import { isTokenExpired, logout, getRefreshedToken } from './auth'; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = Cookies.get('token'); 

    if (token) {
        if (isTokenExpired(token)) {
            try {
                const validToken = await getRefreshedToken(); 
                config.headers.Authorization = `Bearer ${validToken}`;
            } catch (error) {
                console.error("Token refresh/validation failed, logging out:", error.message);
                return Promise.reject(error); 
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Optional: Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && error.config.url !== `${API_BASE_URL}login/`) {
            console.warn("401 Unauthorized response received. Attempting logout.");
            logout(); 
           
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;