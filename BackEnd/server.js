const express = require('express');
const connectDB = require('./config/dbConn');
const studentRouter = require('./routes/studentRoutes');
const studentAuthRouter = require('./routes/studentAuthRoutes');
const corsOptions = require('./config/corsOptions');
const cors=require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

//app config
const app = express();
app.use(cors(corsOptions));
const port=process.env.PORT || 4000;

//middleware
app.use(express.json());

//database connection
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'students');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/students', studentRouter);
app.use('/api/student-auth', studentAuthRouter);
app.use('/images',express.static("uploads"))
app.use("/api/user",require("./routes/userRoute"))
// Removed notifications routes
app.use("/api/superadmin", require("./routes/superAdminRoutes"))
app.use("/api/courses", require("./routes/courseRoutes"))
app.use("/api/student-courses", require("./routes/studentCourseRoutes"))

app.get('/',(req,res)=>{
    res.send('Welcome to RestOpen API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
