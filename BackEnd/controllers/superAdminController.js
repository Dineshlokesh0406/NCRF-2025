const SuperAdmin = require('../models/SuperAdmin');
const LoginHistory = require('../models/LoginHistory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Check if a SuperAdmin already exists
exports.checkSuperAdminExists = async (req, res) => {
    try {
        const count = await SuperAdmin.countDocuments();
        return res.status(200).json({
            success: true,
            exists: count > 0
        });
    } catch (error) {
        console.error('Error checking SuperAdmin existence:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Register a new SuperAdmin (only if none exists)
exports.register = async (req, res) => {
    try {
        // Check if a SuperAdmin already exists
        const count = await SuperAdmin.countDocuments();
        if (count > 0) {
            return res.status(400).json({
                success: false,
                message: 'SuperAdmin already exists'
            });
        }

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if email is already registered
        const existingUser = await SuperAdmin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new SuperAdmin
        const superAdmin = new SuperAdmin({
            name,
            email,
            password: hashedPassword
        });

        await superAdmin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: superAdmin._id, role: 'superadmin' },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token and user data (excluding password)
        const userData = {
            _id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: 'superadmin'
        };

        return res.status(201).json({
            success: true,
            message: 'SuperAdmin registered successfully',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Login SuperAdmin
exports.login = async (req, res) => {
    try {
        const { email, password, twoFactorCode } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            // Record failed login attempt
            await new LoginHistory({
                userId: null,
                ipAddress,
                userAgent,
                status: 'failed',
                browser: getBrowserInfo(userAgent),
                os: getOSInfo(userAgent),
                device: getDeviceInfo(userAgent)
            }).save();

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            // Record failed login attempt
            await new LoginHistory({
                userId: superAdmin._id,
                ipAddress,
                userAgent,
                status: 'failed',
                browser: getBrowserInfo(userAgent),
                os: getOSInfo(userAgent),
                device: getDeviceInfo(userAgent)
            }).save();

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if 2FA is enabled
        if (superAdmin.twoFactorEnabled) {
            // If 2FA is enabled but no code provided, return need for 2FA
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: true,
                    requires2FA: true,
                    message: 'Two-factor authentication code required'
                });
            }

            // Verify 2FA code
            const verified = speakeasy.totp.verify({
                secret: superAdmin.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorCode,
                window: 1 // Allow 1 period before and after for clock drift
            });

            if (!verified) {
                // Record failed login attempt
                await new LoginHistory({
                    userId: superAdmin._id,
                    ipAddress,
                    userAgent,
                    status: 'failed',
                    browser: getBrowserInfo(userAgent),
                    os: getOSInfo(userAgent),
                    device: getDeviceInfo(userAgent)
                }).save();

                return res.status(401).json({
                    success: false,
                    message: 'Invalid two-factor authentication code'
                });
            }
        }

        // Update last login time
        superAdmin.lastLogin = new Date();
        await superAdmin.save();

        // Record successful login
        await new LoginHistory({
            userId: superAdmin._id,
            ipAddress,
            userAgent,
            status: 'success',
            browser: getBrowserInfo(userAgent),
            os: getOSInfo(userAgent),
            device: getDeviceInfo(userAgent)
        }).save();

        // Generate JWT token
        const token = jwt.sign(
            { id: superAdmin._id, role: 'superadmin' },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token and user data (excluding password)
        const userData = {
            _id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: 'superadmin',
            twoFactorEnabled: superAdmin.twoFactorEnabled,
            photo: superAdmin.photo,
            lastLogin: superAdmin.lastLogin
        };

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Helper functions for user agent parsing
function getBrowserInfo(userAgent) {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    return 'Unknown';
}

function getOSInfo(userAgent) {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
}

function getDeviceInfo(userAgent) {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
}

// Verify SuperAdmin token
exports.verify = async (req, res) => {
    try {
        // The auth middleware already verified the token
        // Just return success
        return res.status(200).json({
            success: true,
            message: 'Token is valid'
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the SuperAdmin by email
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'No account found with that email'
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: superAdmin._id, purpose: 'password-reset' },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // In a real application, you would send an email with the reset link
        // For this example, we'll just return the token in the response
        console.log(`Reset token for ${email}: ${resetToken}`);

        return res.status(200).json({
            success: true,
            message: 'Password reset instructions sent to your email',
            // In a real app, you wouldn't include the token in the response
            // This is just for demonstration purposes
            resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Verify reset token
exports.verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Check if the token is for password reset
        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset token'
            });
        }

        // Find the SuperAdmin by ID
        const superAdmin = await SuperAdmin.findById(decoded.id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Token is valid'
        });
    } catch (error) {
        console.error('Reset token verification error:', error);
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Check if the token is for password reset
        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset token'
            });
        }

        // Find the SuperAdmin by ID
        const superAdmin = await SuperAdmin.findById(decoded.id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the password
        superAdmin.password = hashedPassword;
        await superAdmin.save();

        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.user.id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        // Update name if provided
        if (req.body.name) {
            superAdmin.name = req.body.name;
        }

        // Update password if provided
        if (req.body.currentPassword && req.body.newPassword) {
            // Verify current password
            const isMatch = await bcrypt.compare(req.body.currentPassword, superAdmin.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
            superAdmin.password = hashedPassword;
        }

        // Save changes
        await superAdmin.save();

        // Return updated user data (excluding password)
        const userData = {
            _id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: 'superadmin'
        };

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get settings
exports.getSettings = async (req, res) => {
    try {
        // In a real application, you would fetch settings from the database
        // For this example, we'll return default settings
        const defaultSettings = {
            emailNotifications: true,
            systemUpdates: true,
            securityAlerts: true,
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            autoLogout: 30
        };

        return res.status(200).json({
            success: true,
            settings: defaultSettings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        // In a real application, you would update settings in the database
        // For this example, we'll just return success
        return res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings: req.body
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Setup 2FA
exports.setup2FA = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.user.id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        // Generate a secret
        const secret = speakeasy.generateSecret({
            name: `NCRF SuperAdmin (${superAdmin.email})`
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        // Store the secret temporarily (not enabled yet)
        superAdmin.twoFactorSecret = secret.base32;
        await superAdmin.save();

        // Generate backup codes
        const backupCodes = [];
        for (let i = 0; i < 10; i++) {
            backupCodes.push({
                code: crypto.randomBytes(4).toString('hex'),
                used: false
            });
        }

        // Store backup codes
        superAdmin.twoFactorBackupCodes = backupCodes;
        await superAdmin.save();

        return res.status(200).json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
            backupCodes: backupCodes.map(code => code.code)
        });
    } catch (error) {
        console.error('2FA setup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Verify 2FA code
exports.verify2FA = async (req, res) => {
    try {
        const { token } = req.body;
        const superAdmin = await SuperAdmin.findById(req.user.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: superAdmin.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1 // Allow 1 period before and after for clock drift
        });

        return res.status(200).json({
            success: true,
            verified
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Enable 2FA
exports.enable2FA = async (req, res) => {
    try {
        const { token } = req.body;
        const superAdmin = await SuperAdmin.findById(req.user.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        // Verify the token before enabling 2FA
        const verified = speakeasy.totp.verify({
            secret: superAdmin.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Enable 2FA
        superAdmin.twoFactorEnabled = true;
        await superAdmin.save();

        return res.status(200).json({
            success: true,
            message: 'Two-factor authentication enabled successfully'
        });
    } catch (error) {
        console.error('2FA enable error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
    try {
        const { token, password } = req.body;
        const superAdmin = await SuperAdmin.findById(req.user.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Verify the token before disabling 2FA
        const verified = speakeasy.totp.verify({
            secret: superAdmin.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Disable 2FA
        superAdmin.twoFactorEnabled = false;
        superAdmin.twoFactorSecret = undefined;
        superAdmin.twoFactorBackupCodes = [];
        await superAdmin.save();

        return res.status(200).json({
            success: true,
            message: 'Two-factor authentication disabled successfully'
        });
    } catch (error) {
        console.error('2FA disable error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get 2FA Status
exports.get2FAStatus = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.user.id);

        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'SuperAdmin not found'
            });
        }

        return res.status(200).json({
            success: true,
            enabled: superAdmin.twoFactorEnabled,
            backupCodes: superAdmin.twoFactorEnabled ?
                superAdmin.twoFactorBackupCodes.filter(code => !code.used).map(code => code.code) : []
        });
    } catch (error) {
        console.error('2FA status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get login history
exports.getLoginHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const loginHistory = await LoginHistory.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await LoginHistory.countDocuments({ userId: req.user.id });

        return res.status(200).json({
            success: true,
            loginHistory,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get login history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
