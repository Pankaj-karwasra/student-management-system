const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    description:String,
    credits:{
        type:Number,
        required:true,
        min:1,
        max:6
    },

    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }],

    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('Course',courseSchema)