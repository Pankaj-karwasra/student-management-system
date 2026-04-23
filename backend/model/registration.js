const mongoose = require('mongoose')

const regSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
})

module.exports = mongoose.model('registration',regSchema)