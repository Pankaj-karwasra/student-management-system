import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom
import { register } from '../utilis/auth';
import { useAuthStore } from '../store/auth';

const CreateAccount = () => {
    const navigate = useNavigate();
    const { loading, setLoading } = useAuthStore(); // Get loading state from store

    const [formData, setFormData] = useState({
        fullName: '',
        username: '', // Added username as per your backend schema
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors

        const { fullName, username, email, password, confirmPassword } = formData;

        // Basic client-side validation
        if (!fullName || !username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) { // Example: minimum password length
            setError("Password must be at least 6 characters long.");
            return;
        }
        // More robust email/username validation can be added here

        setLoading(true); // Set loading state
        try {
            const { error: apiError } = await register({ username, email, password, confirmPassword });

            if (apiError) {
                setError(apiError);
            } else {
                alert("Account created and logged in successfully!");
                navigate('/dashboard'); // Redirect to a dashboard or home page after successful registration
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setError("An unexpected error occurred during registration.");
        } finally {
            setLoading(false); // Clear loading state
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-10">
                    <div className="card auth-card shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Create Account</h3>
                            <form onSubmit={handleSubmit}>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input type="text" className="form-control" id="fullName" value={formData.fullName} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="ms-2">Signing Up...</span>
                                            </>
                                        ) : "Sign Up"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <small>Already have an account? <a href="/login">Login</a></small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;