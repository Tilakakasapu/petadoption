import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      console.log(`🔍 Checking user with email: ${email}`);
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log('❌ User not found');
        return done(null, false, { message: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('❌ Password incorrect');
        return done(null, false, { message: 'Invalid credentials' });
      }
      console.log('✅ User authenticated successfully');
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
declare global {
    namespace Express {
      interface User {
        _id: mongoose.Types.ObjectId;
        email: string;
      }
    }
  }