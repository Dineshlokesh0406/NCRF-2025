const express = require('express');
const userRouter = express.Router();
const {
    loginUser,
    registerUser,
    verifyToken,
    updateProfile,
    changePassword,
    getAllAdmins,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin
} = require('../controllers/userController');
const upload = require('../middleware/userUpload');

// Auth routes
userRouter.post('/register', upload.single('photo'), registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/verify', verifyToken);

// Profile routes
userRouter.put('/profile', upload.single('photo'), updateProfile);
userRouter.put('/change-password', changePassword);

// Admin management routes
userRouter.get('/admins', getAllAdmins);
userRouter.get('/:email', getAdminByEmail);
userRouter.put('/:email', upload.single('photo'), updateAdmin);
userRouter.delete('/:email', deleteAdmin);

module.exports = userRouter;