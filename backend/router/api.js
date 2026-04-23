const router = require('express').Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const regc = require('../controllers/regcontrollers')
const studentc = require('../controllers/studentcontrollers')
const auth = require('../middlewares/auth')
const upload = require('../helpers/upload');



const { commonLimiter, addStudentLimiter, loginLimiter } = require('../helpers/rateLimiters');


// --- Authentication Routes ---
// signup - No specific rate limit needed beyond general IP protection, or you could add one
router.post('/reg', regc.register);

// login - Apply the login-specific rate limit here
router.post('/login', loginLimiter, regc.login); // <--- Applied loginLimiter


// change Password - Requires authentication, then common limiter
router.post('/changepassword', auth, commonLimiter, regc.changePassword); // <--- Applied commonLimiter


// --- Student Management Routes ---

// student post - Requires authentication, file upload, then addStudentLimiter
router.post('/addstudent', auth, upload.single('img'), addStudentLimiter, studentc.addStudent); // <--- Applied addStudentLimiter


// get student (all) - Requires authentication, then common limiter
router.get('/getstudent', auth, commonLimiter, studentc.getStudent); // <--- Applied commonLimiter


// Get student by ID - Requires authentication, then common limiter
router.get('/getstudent/:id', auth, commonLimiter, studentc.getStudentById); // <--- Applied commonLimiter


// Update student - Requires authentication, file upload, then common limiter
router.put('/updatestudent/:id', auth, upload.single('img'), commonLimiter, studentc.updateStudent); // <--- Applied commonLimiter


// Delete student - Requires authentication, then common limiter
router.delete('/deletestudent/:id', auth, commonLimiter, studentc.deleteStudent);


module.exports = router