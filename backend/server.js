const express = require('express')
app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
const cors = require('cors'); 
const path = require('path');

// DB connect
const mongoose = require('mongoose')
const session = require('express-session')
mongoose.connect('mongodb://localhost:27017/student_db')
const apiRouter = require('./router/api')





const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true,
  optionsSuccessStatus: 204 
};



app.use(session({
    secret:'abc',
    resave:false,
    saveUninitialized:false
}))

app.use(cors(corsOptions));
app.use('/api',apiRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'))
app.listen(5000)