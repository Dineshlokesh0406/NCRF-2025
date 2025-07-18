const userModel=require('../model/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const validator=require('validator');
const path = require('path');
const fs = require('fs');


const createToken = (id => {
    return jwt.sign(
        { id },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    )
})

// Middleware to verify token
const verifyToken = async (req, res) => {
    try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const { id } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

            // Find user by id
            const user = await userModel.findById(id).select('-password');

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // Check if user is a Faculty
            if (user.role !== 'Faculty') {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            return res.status(200).json({ success: true, user });
        } catch (error) {
            console.log('Token verification error:', error);
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
    } catch (error) {
        console.log('Auth error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Check if user is a Faculty
        console.log('User role:', user.role);
        if (user.role !== 'Faculty') {
            console.log('Access denied. User role is not Faculty');
            return res.status(403).json({ success: false, message: "Access denied. Only Faculty accounts can login." });
        }

        // Verify password
        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Create token
        const token = createToken(user._id);

        // Return user data without password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo
        };

        res.status(200).json({
            success: true,
            token,
            user: userData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const registerUser=async (req,res)=>{
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const {name, password, email, role} = req.body;
    try{
        // Check if required fields are provided
        if(!name || !email || !password) {
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        const exists=await userModel.findOne({email})
        if(exists)
            return res.status(400).json({success:false,message:"Email already exists"})

        if(!validator.isEmail(email))
            return res.status(400).json({success:false,message:"Invalid Email"})
        if(password.length<6)
            return res.status(400).json({success:false,message:"Password should be atleast 6 characters long"})

        // Create user object with photo path if available
        const userData = {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: role || 'admin'
        };

        if (req.file) {
            userData.photo = `/uploads/users/${req.file.filename}`;
        }

        const user = await userModel.create(userData);
        const token = createToken(user._id)
        res.status(201).json({success:true,token})
    }catch (err){
            console.log(err)
            res.status(500).json({success:false,message:"Internal server Error"})
    }
}

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({ role: 'Faculty' })
            .select('-password -cartData')
            .sort({ name: 1 });

        res.status(200).json(admins);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get admin by email
const getAdminByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const admin = await userModel.findOne({ email, role: 'Faculty' })
            .select('-password -cartData');

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json(admin);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update admin
const updateAdmin = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, password, role } = req.body;

        // Find the admin
        const admin = await userModel.findOne({ email, role: 'Faculty' });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Update fields
        const updateData = {};
        if (role) updateData.role = role;

        // Update password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update photo if provided
        if (req.file) {
            updateData.photo = `/uploads/users/${req.file.filename}`;
        }

        const updatedAdmin = await userModel.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        ).select('-password -cartData');

        res.status(200).json({ success: true, admin: updatedAdmin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const { email } = req.params;

        // Find and delete the admin
        const result = await userModel.findOneAndDelete({ email, role: 'Faculty' });

        if (!result) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        // Get user ID from token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        const { id } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Find user
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields
        const updateData = {};

        if (req.body.name) {
            updateData.name = req.body.name;
        }

        // Handle photo upload
        if (req.file) {
            // Delete old photo if exists
            if (user.photo) {
                const oldPhotoPath = path.join(__dirname, '..', user.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }

            // Set new photo path
            updateData.photo = `/uploads/users/${req.file.filename}`;
        }

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, select: '-password' }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        // Get user ID from token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        const { id } = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Find user
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current password and new password are required' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter' });
        }

        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter' });
        }

        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one number' });
        }

        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one special character' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await userModel.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports={
    loginUser,
    registerUser,
    verifyToken,
    updateProfile,
    changePassword,
    getAllAdmins,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin
}