// helpers/rateLimiters.js

const rateLimit = require('express-rate-limit');

const commonLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    statusCode: 429,
    headers: true,
});

const addStudentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Too many attempts to add student from this IP, please try again after 1 minute",
    statusCode: 429,
    headers: true,
});

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "Too many login attempts from this IP, please try again after 5 minutes",
    statusCode: 429,
    headers: true,
});

// !!! CRITICAL: Ensure you are exporting them like this !!!
module.exports = {
    commonLimiter,
    addStudentLimiter,
    loginLimiter,
};