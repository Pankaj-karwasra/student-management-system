import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../service/frontAPI';
import { Link } from 'react-router-dom';

const StudentList = () => {
    const [allStudents, setAllStudents] = useState([]); 
    const [currentStudents, setCurrentStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(1); 

    const fetchStudents = async () => {
        try {
            const data = await getStudents();
            setAllStudents(data); 
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch students. Please try again later.');
            setLoading(false);
            console.error('Error in StudentList:', err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);


    useEffect(() => {
        const indexOfLastStudent = currentPage * studentsPerPage;
        const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
        setCurrentStudents(allStudents.slice(indexOfFirstStudent, indexOfLastStudent));
    }, [allStudents, currentPage, studentsPerPage]); 

    const handleDeleteClick = async (studentId, studentName) => {
        if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
            try {
                await deleteStudent(studentId);
                
                fetchStudents();
                alert(`${studentName} deleted successfully!`);
            } catch (err) {
                console.error('Error deleting student:', err);
                alert(`Failed to delete ${studentName}. Please try again.`);
            }
        }
    };


    const totalPages = Math.ceil(allStudents.length / studentsPerPage);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading students...</p>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Student List</h2>
                <Link to="/addStudent" className="btn btn-primary">Add New Student</Link>
            </div>

            <div className="table-responsive">
                {allStudents.length === 0 ? ( 
                    <div className="alert alert-info text-center" role="alert">
                        No students found. <Link to="/addStudent">Add your first student!</Link>
                    </div>
                ) : (
                    <>
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.map(student => (
                                    <tr key={student._id}>
                                        <td>
                                            <img
                                                src={student.img ? `http://localhost:5000/uploads/${student.img}` : 'https://via.placeholder.com/50'}
                                                alt={`${student.first_name} ${student.last_name}`}
                                                className="rounded-circle"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{`${student.first_name} ${student.last_name}`}</td>
                                        <td>{student.email}</td>
                                        <td>{student.phone || 'N/A'}</td>
                                        <td>
                                            <Link to={`/editStudent/${student._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(student._id, `${student.first_name} ${student.last_name}`)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                     
                        {totalPages > 1 && ( 
                            <nav aria-label="Student Pagination" className="mt-4">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </button>
                                    </li>
                                    {pageNumbers.map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button onClick={() => paginate(number)} className="page-link">
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentList;