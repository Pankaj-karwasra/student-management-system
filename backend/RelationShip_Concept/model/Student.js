const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        trim:true
    },
    last_name:{
        type:String,
        required:true,
        trim:true
    },
    emal:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    student_profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StudentProfile',
        unique:true,
        sparse:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Student'.studentSchema)