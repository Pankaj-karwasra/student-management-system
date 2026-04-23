const studentModel = require('../model/studentModel')


// Post
exports.addStudent = async (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body;
    const filename = req.file ? req.file.filename : studentModel.schema.paths.img.options.default;

    try {
        const newRecord = await new studentModel({
            first_name,
            last_name,
            email,
            phone,
            address,
            img: filename 
        });


        const savedRecord = await newRecord.save();
        
        res.status(201).json({
            message: 'Student successfully added!',
            student: savedRecord
        });

    } catch (error) {
        console.error('Database save error:', error);

        if (error.code === 11000) { 
            return res.status(400).json({ 
                error: 'Email or phone number already exists.', 
                details: error.message 
            });
        }
        if (error.name === 'ValidationError') {
             return res.status(400).json({ 
                error: 'Validation failed.', 
                details: error.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to add student due to a server error.' 
        });
    }
};



// Get
exports.getStudent =async (req,res)=>{
    try{
        const data = await studentModel.find()
        res.status(200).json({
            success:true,
            message:"Student fetched successfully",
            data:data
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:'Error fetching students',
            error:error.message
        })

    }

}

// Get By ID
exports.getStudentById = async (req,res)=>{
    try{

       const id = req.params.id
       const student = await studentModel.findById(id)

       if(!student){
        return res.status(400).json({
            success:false,
            message:'Student not found'
        })
       }
       res.status(200).json({
        success:true,
        message:"Student fetched successfully",
        data:student
       })

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Error fetching student by Id",
            error:error.message
        })

    }

}


//Update student by ID
exports.updateStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const filename = req.file ? req.file.filename : undefined; 

        const existingStudent = await studentModel.findById(id);
        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (filename) {
            updatedData.img = filename;
        } else if (!updatedData.img && existingStudent.img) {
            updatedData.img = existingStudent.img;
        } else if (updatedData.img === 'null' || updatedData.img === '') {

            updatedData.img = studentModel.schema.paths.img.options.default;
        }


        const updatedStudent = await studentModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found after update attempt" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent
        });
    } catch (error) {
        console.error('Error updating student:', error); 
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Email or phone number already exists.',
                details: error.message
            });
        }
        if (error.name === 'ValidationError') {
             return res.status(400).json({
                error: 'Validation failed.',
                details: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating student",
            error: error.message
        });
    }
};


//  Delete student by ID
exports.deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedStudent = await studentModel.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            data: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting student",
            error: error.message
        });
    }
};