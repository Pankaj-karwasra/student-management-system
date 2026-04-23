import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utilis/axiosInstance'; // Use the configured axios instance
import { useAuthStore } from '../store/auth';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { loading, setLoading, isLoggedIn } = useAuthStore();

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const { oldPassword, newPassword, confirmNewPassword } = formData;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setError("All fields are required.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) { // Example minimum length
            setError("New password must be at least 6 characters long.");
            return;
        }
        if (oldPassword === newPassword) {
            setError("New password cannot be the same as the old password.");
            return;
        }

        // Ensure user is logged in before attempting to change password
        if (!isLoggedIn()) {
            setError("You must be logged in to change your password.");
            navigate('/login'); // Redirect to login
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/changepassword', {
                oldPassword,
                newPassword,
            });

            if (response.status === 200) {
                setSuccess(response.data.message || "Password changed successfully!");
                setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
                // Optionally redirect after a short delay
                // setTimeout(() => navigate('/dashboard'), 2000); 
            }
        } catch (err) {
            console.error("Change password failed:", err);
            setError(err.response?.data?.message || "An unexpected error occurred during password change.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-8">
                    <div className="card auth-card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Change Password</h3>
                            <form onSubmit={handleSubmit}>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                {success && <div className="alert alert-success" role="alert">{success}</div>}
                                <div className="mb-3">
                                    <label htmlFor="oldPassword" className="form-label">Current Password</label>
                                    <input type="password" className="form-control" id="oldPassword" value={formData.oldPassword} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" value={formData.newPassword} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                                    <input type="password" className="form-control" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required disabled={loading} />
                                </div>
                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="ms-2">Updating Password...</span>
                                            </>
                                        ) : "Update Password"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    {/* Changed href to use React Router's navigate for client-side routing */}
                                    <small><a href="/addStudent" onClick={() => navigate('/dashboard')}>Back to Dashboard</a></small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;