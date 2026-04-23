const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true 
    },
    last_name: {
        type: String,
        required: true 
    },
    
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
        lowercase: true, 
    },

    phone: {
        type: String,
        unique: true,
       
        sparse: true 
    },
  
    address: String, 
    
    img: { 
        type: String, 
        default: 'default-url.png' 
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('studentModel', studentSchema);