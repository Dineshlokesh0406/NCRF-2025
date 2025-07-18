const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to MongoDB");

        // Log when the connection is lost
        mongoose.connection.on('disconnected', () => {
            console.log('Lost MongoDB connection...');
        });

        // Log when the connection is reconnected
        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB');
        });

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        // Try to reconnect
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;