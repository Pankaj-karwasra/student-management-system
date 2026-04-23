import axiosInstance from '../utilis/axiosInstance'; 


// POST
export const addStudent = async (studentData) => {
    try {
        const formData = new FormData();
        for (const key in studentData) {
            formData.append(key, studentData[key]);
        }

        const response = await axiosInstance.post('/addstudent', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error.response ? error.response.data : error.message);
        throw error; 
    }
};

// GET
export const getStudents = async () => {
    try {
        const response = await axiosInstance.get('/getstudent'); 
        return response.data.data; 
    } catch (error) {
        console.error('Error fetching students:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/getstudent/${id}`); 
        return response.data.data; 
    } catch (error) {
        console.error(`Error fetching student with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};



// UPDATE student by ID
export const updateStudent = async (id, studentData) => {
    try {
        const formData = new FormData();
        for (const key in studentData) {
            if (key === 'img' && studentData[key] instanceof File) {
                formData.append(key, studentData[key]);
            } else if (key !== 'img' || (key === 'img' && typeof studentData[key] === 'string')) {
                formData.append(key, studentData[key]);
            }
        }

        const response = await axiosInstance.put(`/updatestudent/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating student with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// DELETE student by ID
export const deleteStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/deletestudent/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting student with ID ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};