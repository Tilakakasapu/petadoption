import express from 'express';
import passport from 'passport';
// import User, { IAdoptionRequest } from '../models/User';
import { Request } from 'express';
import User, { IUser } from '../models/User';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

// Get favorites
// In userRoutes.ts

router.get('/favorites', async (req: Request, res) => {
    try {
      const user = await User.findById(req.user!._id)
        .populate('favorites')
        .exec() as IUser;
        
      res.json(user?.favorites || []);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Get adoption requests
  router.get('/requests', async (req, res) => {
    try {
      const user = await User.findById(req.user!._id)
        .populate('adoptionRequests.pet')
        .exec();
        
      res.json(user?.adoptionRequests || []);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
export default router;