import React, { useState, useEffect } from 'react'
import { useParams, useNavigate,Link } from 'react-router-dom'; 
import { getStudentById, updateStudent } from '../service/frontAPI'; 

const EditStudentPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 

    const [studentData, setStudentData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        img: null,
        currentPhotoUrl: 'https://via.placeholder.com/100' 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null); 

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const data = await getStudentById(id);
                setStudentData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone || '', 
                    address: data.address || '', 
                    img: data.img, 
                    currentPhotoUrl: data.img ? `http://localhost:5000/uploads/${data.img}` : 'https://via.placeholder.com/100'
                });
                setLoading(false);
            } catch (err) {
                console.error(`Error fetching student with ID ${id}:`, err);
                setError('Failed to load student data.');
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]); 

    const handleChange = (e) => {
        const { id, value } = e.target;
        setStudentData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const dataToUpdate = {
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            email: studentData.email,
            phone: studentData.phone,
            address: studentData.address,
        };

        if (file) {
            dataToUpdate.img = file; 
        } else {
            dataToUpdate.img = studentData.img; 
        }

        try {
            await updateStudent(id, dataToUpdate);
            alert("Student updated successfully!");
            navigate('/addList'); 
        } catch (err) {
            console.error('Error updating student:', err.response ? err.response.data : err.message);
            setError('Failed to update student. Please check the form and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !studentData.first_name) { 
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading student data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">Edit Student</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            value={studentData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            value={studentData.last_name}
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
                                        value={studentData.email}
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
                                        value={studentData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        rows="3"
                                        value={studentData.address}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="img" className="form-label">Student Photo</label>
                                    <div className="mb-2">
                                        <img
                                            src={studentData.currentPhotoUrl} 
                                            alt="Current Photo"
                                            className="img-thumbnail" 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <small className="form-text text-muted ms-2">Current photo. Upload a new one to replace it.</small>
                                    </div>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="img" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <hr />

                                <div className="text-end">
                                    <Link to="/addList" className="btn btn-secondary me-2">Cancel</Link>
                                    <button type="submit" className="btn btn-warning" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Student'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditStudentPage;