// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth'; // Adjust path if needed

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore(); // Get authentication status

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the children (the component for the route)
    // or an <Outlet /> if used for nested routes
    return children ? children : <Outlet />;
};

export default ProtectedRoute;