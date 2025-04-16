import { Document } from 'mongoose';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface User extends Document<any, any, IUser> {}
    interface Request {
      user?: User;
    }
  }
}