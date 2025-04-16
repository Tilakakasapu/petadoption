import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { isAuthenticated } from '../middleware/auth';
import cors from 'cors';
import mongoose from 'mongoose'; // Import mongoose

const router = express.Router();

// Enable CORS with credentials
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Store password in plain text
    const newUser = new User({
      name,
      email,
      password, // Store plain text password
      favorites: [],
      adoptionRequests: []
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set token in cookie
    res.cookie('token', token, cookieOptions);

    // Return user data (excluding password)
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      favorites: newUser.favorites,
      adoptionRequests: newUser.adoptionRequests
    };

    res.status(201).json({ 
      success: true,
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error registering user' 
    });
  }
});

// Debug route to check user (REMOVE IN PRODUCTION)
router.post('/debug-check-user', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.json({
        exists: false,
        message: 'User not found'
      });
    }

    // Return safe user info
    return res.json({
      exists: true,
      user: {
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      }
    });
  } catch (error) {
    console.error('Debug check error:', error);
    return res.status(500).json({ error: 'Server error during debug check' });
  }
});

// Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    console.log('Reset Password Request:', { email, newPasswordLength: newPassword.length });

    if (!email || !newPassword) {
      console.log('Missing email or new password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and new password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    console.log('Password reset successful for user:', user._id);
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset'
    });
  }
});

// Debug route to verify stored password (REMOVE IN PRODUCTION)
router.post('/verify-stored-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.json({
        exists: false,
        message: 'User not found'
      });
    }

    // Return safe password info
    return res.json({
      exists: true,
      passwordInfo: {
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
        isHashed: false // Plain text password
      }
    });
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ error: 'Server error during verification' });
  }
});

// Login route with enhanced logging
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('\n=== DETAILED LOGIN ATTEMPT ===');
    console.log('Raw Request Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw Request Body:', JSON.stringify(req.body, null, 2));
    
    // 1. Validate request body
    const { email, password } = req.body;
    
    // Extensive logging for debugging
    console.log('Parsed Credentials:', {
      emailProvided: !!email,
      emailType: typeof email,
      emailValue: email,
      passwordProvided: !!password,
      passwordType: typeof password,
      passwordLength: password ? password.length : 'N/A'
    });

    // Validate input types
    if (typeof email !== 'string' || typeof password !== 'string') {
      console.log('Invalid input types:', {
        emailType: typeof email,
        passwordType: typeof password
      });
      return res.status(400).json({
        success: false,
        error: 'Invalid input types'
      });
    }

    // Trim and validate email and password
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      console.log('Empty email or password after trimming');
      return res.status(400).json({
        success: false,
        error: 'Email and password cannot be empty'
      });
    }

    // 2. Find user with extensive logging
    console.log('Attempting to find user...');
    const user = await User.findOne({ email: trimmedEmail }).select('+password');
    
    console.log('User Lookup Details:', {
      userFound: !!user,
      userId: user?._id?.toString(),
      hasPassword: !!user?.password,
      passwordLength: user?.password?.length || 0,
      isPasswordHashed: false // Plain text password
    });

    if (!user) {
      console.log(`No user found with email: ${trimmedEmail}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    if (!user.password) {
      console.log('User exists but has no password');
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // 3. Compare passwords with detailed logging
    console.log('Attempting password comparison...');
    try {
      if (user.password !== trimmedPassword) {
        console.log('Password mismatch');
        return res.status(400).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error during authentication'
      });
    }

    // 4. Generate token
    console.log('Generating authentication token...');
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 5. Set cookie
    res.cookie('token', token, {
      ...cookieOptions,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // 6. Prepare user response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      adoptionRequests: user.adoptionRequests
    };

    console.log('Login successful!');
    return res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Unexpected login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unexpected server error'
    });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  try {
    res.clearCookie('token', cookieOptions);
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error logging out' 
    });
  }
});

// Get current user
router.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authenticated' 
      });
    }

    const user = await User.findById(req.user._id)
      .populate('favorites')
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

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      adoptionRequests: user.adoptionRequests
    };

    res.json({ 
      success: true,
      user: userResponse 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching user data' 
    });
  }
});

export default router;