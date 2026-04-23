import React, { useState } from 'react';
import { addStudent } from '../service/frontAPI'; 
import { useNavigate } from 'react-router-dom'; 

const AddStudentPage = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        img: null, 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            img: e.target.files[0] 
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await addStudent(formData);
            setSuccess(response.message || 'Student successfully added!');
            setLoading(false);
            setFormData({ 
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: '',
                img: null,
            });
            
            document.getElementById('studentPhoto').value = ''; 

            setTimeout(() => {
                navigate('/addList'); 
            }, 2000);

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response && err.response.data && err.response.data.error 
                                 ? err.response.data.error 
                                 : 'Failed to add student. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">Add New Student</h3>
                            </div>
                            <div className="card-body">
                                {loading && <div className="alert alert-info">Adding student...</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="firstName" className="form-label">First Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="firstName" 
                                                name="first_name" 
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="lastName" className="form-label">Last Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="lastName" 
                                                name="last_name" 
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="email" 
                                            name="email" 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            id="phone" 
                                            name="phone" 
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <textarea 
                                            className="form-control" 
                                            id="address" 
                                            name="address" 
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="studentPhoto" className="form-label">Student Photo</label>
                                        <input 
                                            className="form-control" 
                                            type="file" 
                                            id="studentPhoto" 
                                            name="img" 
                                            accept="image/*" 
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    
                                    <hr />

                                    <div className="text-end">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary me-2"
                                            onClick={() => navigate(-1)} 
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Student'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddStudentPage;