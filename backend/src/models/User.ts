import mongoose, { Schema, Document } from 'mongoose';

export interface AdoptionRequest {
  petId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  adoptionRequests: AdoptionRequest[];
}

const userSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password by default in queries
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet' 
  }],
  adoptionRequests: [{
    petId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Pet', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);