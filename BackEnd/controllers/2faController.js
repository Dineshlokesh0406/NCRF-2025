const SuperAdmin = require('../models/SuperAdmin');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

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
