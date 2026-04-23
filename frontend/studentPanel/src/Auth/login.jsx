import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utilis/auth';
import { useAuthStore } from '../store/auth';

const Login = () => {
    const navigate = useNavigate();
    const { loading, setLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const { email, password } = formData;

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);
        try {
            const { error: apiError } = await login(email, password);

            if (apiError) {
                setError(apiError);
            } else {
                alert("Login successful!");
                navigate('/addStudent');
            }
        } catch (err) {
            if (err.response && err.response.status === 429) {
                // For 429 errors, show a generic message in the UI
                setError("Login failed due to unexpected error.");
                // Log the specific rate limit message to the console for debugging
                console.warn("Rate limit hit during login attempt:", err.response.data.message || "Too many requests. Please try again after some time.");
            } else if (err.response && err.response.data && err.response.data.message) {
                // For other API errors with a specific message, show that message
                setError(err.response.data.message);
            } else {
                // Generic error for any other unexpected issues
                console.error("Login failed:", err);
                setError("Login failed due to unexpected error.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-10">
                    <div className="card auth-card shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Login</h3>
                            <form onSubmit={handleSubmit}>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="ms-2">Logging In...</span>
                                            </>
                                        ) : "Login"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <small>Don't have an account? <a href="/signup">Sign Up</a></small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;