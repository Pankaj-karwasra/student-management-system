import React from 'react';
import { logout as authLogout } from '../utilis/auth.js'; 

const Header = () => {
     const handleLogout = () => {
        authLogout(); // Call the logout function from utilis/auth.js
        // Optionally redirect to login or home page after logout
        window.location.href = '/login'; 
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="/addList">StudentMS</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav" 
                    aria-expanded="false"
                    aria-label="Toggle navigation" 
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                 
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                           
                            <a className="nav-link active" aria-current="page" href="/addList">Students</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/addStudent">Add Student</a>
                        </li>
                    </ul>
                   
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/changePassword">Change Password</a>
                        </li>
                        <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;