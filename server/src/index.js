require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');

        app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
