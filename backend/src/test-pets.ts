import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import petRoutes from './routes/petRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Use pet routes
app.use('/api/pets', petRoutes);

const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/pet-adoption';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Pet routes server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
