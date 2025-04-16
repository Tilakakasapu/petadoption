"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const Pet_1 = __importDefault(require("../models/Pet"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
// Enable CORS with credentials
router.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only image files are allowed'));
        }
    }
});
// Helper function to transform pet data
const transformPetData = (pet) => {
    var _a;
    return (Object.assign(Object.assign({}, pet.toObject()), { photo: ((_a = pet.photo) === null || _a === void 0 ? void 0 : _a.data) ? {
            data: `data:${pet.photo.contentType};base64,${pet.photo.data.toString('base64')}`,
            contentType: pet.photo.contentType
        } : null }));
};
// GET all pets
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching all pets...');
        const pets = yield Pet_1.default.find();
        console.log(`Found ${pets.length} pets`);
        const transformedPets = pets.map(transformPetData);
        console.log('Successfully transformed pets data');
        res.json({
            success: true,
            pets: transformedPets
        });
    }
    catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pets',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get a single pet by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pet = yield Pet_1.default.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.json({
            success: true,
            pet: transformPetData(pet)
        });
    }
    catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch pet details',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Create a new pet
router.post('/', auth_1.isAuthenticated, upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, breed, age, location, description, health, characteristics } = req.body;
        // Validate required fields
        if (!name || !type || !breed || !age || !location) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields: name, type, breed, age, and location'
            });
        }
        // Parse health and characteristics from form data
        const parsedHealth = typeof health === 'string' ? JSON.parse(health) : health;
        const parsedCharacteristics = typeof characteristics === 'string'
            ? characteristics.split(',').map(c => c.trim()).filter(c => c)
            : characteristics || [];
        // Create new pet
        const pet = new Pet_1.default({
            name,
            type,
            breed,
            age: Number(age),
            location,
            description,
            photo: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined,
            health: {
                vaccinated: (parsedHealth === null || parsedHealth === void 0 ? void 0 : parsedHealth.vaccinated) || false,
                neutered: (parsedHealth === null || parsedHealth === void 0 ? void 0 : parsedHealth.neutered) || false,
                microchipped: (parsedHealth === null || parsedHealth === void 0 ? void 0 : parsedHealth.microchipped) || false
            },
            characteristics: parsedCharacteristics
        });
        yield pet.save();
        console.log('Pet saved successfully:', pet._id);
        res.status(201).json({
            success: true,
            pet: transformPetData(pet)
        });
    }
    catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create pet',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Update a pet
router.put('/:id', auth_1.isAuthenticated, upload.single('photo'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, breed, age, location, description } = req.body;
        const updateData = {
            name,
            breed,
            age: Number(age),
            location,
            description
        };
        if (req.file) {
            updateData.photo = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
        const pet = yield Pet_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.json({
            success: true,
            pet: transformPetData(pet)
        });
    }
    catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update pet',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Delete a pet
router.delete('/:id', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pet = yield Pet_1.default.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.json({
            success: true,
            message: 'Pet deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete pet',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Add/Remove pet to/from favorites
router.post('/:id/favorite', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        const pet = yield Pet_1.default.findById(req.params.id);
        if (!user || !pet) {
            return res.status(404).json({
                success: false,
                error: 'User or pet not found'
            });
        }
        const isFavorite = user.favorites.includes(pet._id);
        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => !id.equals(pet._id));
        }
        else {
            // Add to favorites
            user.favorites.push(pet._id);
        }
        yield user.save();
        res.json({
            success: true,
            isFavorite: !isFavorite,
            message: `Pet ${!isFavorite ? 'added to' : 'removed from'} favorites`
        });
    }
    catch (error) {
        console.error('Error updating favorites:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update favorites',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get user's adoption requests
router.get('/user/adoption-requests', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id)
            .populate({
            path: 'adoptionRequests.petId',
            model: 'Pet'
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        // Transform adoption requests with proper typing
        const adoptionRequests = user.adoptionRequests.map(request => ({
            petId: request.petId ? transformPetData(request.petId) : null,
            status: request.status,
            createdAt: request.createdAt
        }));
        res.json({
            success: true,
            adoptionRequests
        });
    }
    catch (error) {
        console.error('Error fetching adoption requests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch adoption requests',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Submit adoption request
router.post('/:id/adopt', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        const pet = yield Pet_1.default.findById(req.params.id);
        if (!user || !pet) {
            return res.status(404).json({
                success: false,
                error: 'User or pet not found'
            });
        }
        // Check if user already has a pending request for this pet
        const existingRequest = user.adoptionRequests.find(request => request.petId.equals(pet._id) && request.status === 'pending');
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: 'You already have a pending adoption request for this pet'
            });
        }
        // Add new adoption request
        user.adoptionRequests.push({
            petId: pet._id,
            status: 'pending',
            createdAt: new Date()
        });
        yield user.save();
        res.json({
            success: true,
            message: 'Adoption request submitted successfully'
        });
    }
    catch (error) {
        console.error('Error submitting adoption request:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit adoption request',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Add pet adoption endpoint
router.post('/:id/adopt', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pet = yield Pet_1.default.findById(req.params.id);
        const user = yield User_1.default.findById(req.user._id);
        if (!pet || !user) {
            return res.status(404).json({
                success: false,
                error: 'Pet or user not found'
            });
        }
        // Check if pet is already adopted
        if (pet.status === 'adopted') {
            return res.status(400).json({
                success: false,
                error: 'This pet has already been adopted'
            });
        }
        // Update pet status to adopted
        pet.status = 'adopted';
        yield pet.save();
        // Add adoption request to user's records
        user.adoptionRequests.push({
            petId: pet._id,
            status: 'approved',
            createdAt: new Date()
        });
        yield user.save();
        res.json({
            success: true,
            message: 'Pet adopted successfully',
            pet: transformPetData(pet)
        });
    }
    catch (error) {
        console.error('Error adopting pet:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to adopt pet',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get user's favorites
router.get('/user/favorites', auth_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).populate('favorites');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        const transformedFavorites = user.favorites.map(transformPetData);
        res.json({
            success: true,
            favorites: transformedFavorites
        });
    }
    catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch favorites',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
exports.default = router;
