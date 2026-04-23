const registration = require('../model/registration')

const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken');

const SECRET_KEY = "secret123@#@#$%key343";


// signup
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const usercheck = await registration.findOne({ email });
        if (usercheck) {
            return res.status(400).json({ message: `${email} is already registered` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new registration({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({
            message: "User created successfully",
            status: 201,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message, status: 500 });
    }
};



// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await registration.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            status: 200,
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message, status: 500 });
    }
};




// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Ensure old and new passwords are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old password and new password are required." });
        }

        // Access the email from the middleware-attached userEmail
        const email = req.userEmail; // <--- Changed from req.user.email to req.userEmail
        
        if (!email) {
            // This should ideally not happen if middleware is correctly set and token is valid
            return res.status(401).json({ message: "Unauthorized: User email not found in token context." });
        }

        const user = await registration.findOne({ email });
        if (!user) {
            // This could happen if a user's email was changed after token issuance, or token is very old
            return res.status(404).json({ message: "User not found associated with the provided token." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect." }); // Use 401 for auth failure
        }
        
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password changed successfully", status: 200 });

    } catch (error) {
        console.error("Change password controller error:", error); 
        res.status(500).json({ message: "Internal server error during password change.", error: error.message, status: 500 });
    }
};