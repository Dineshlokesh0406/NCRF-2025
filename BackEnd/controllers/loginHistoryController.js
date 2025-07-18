const LoginHistory = require('../models/LoginHistory');

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
