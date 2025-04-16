import mongoose, { Schema, Document } from 'mongoose';

export interface HealthInfo {
  vaccinated: boolean;
  neutered: boolean;
  microchipped: boolean;
}

export interface IPet extends Document {
  name: string;
  type: string;
  breed: string;
  age: number;
  location: string;
  description?: string;
  photo?: {
    data: Buffer;
    contentType: string;
  };
  status: 'available' | 'adopted' | 'pending';
  health: HealthInfo;
  characteristics: string[];
}

const petSchema = new Schema<IPet>({
  name: { 
    type: String, 
    required: [true, 'Please provide a name']
  },
  type: {
    type: String,
    required: [true, 'Please provide a type'],
    enum: ['dog', 'cat', 'bird', 'other']
  },
  breed: { 
    type: String, 
    required: [true, 'Please provide a breed']
  },
  age: { 
    type: Number, 
    required: [true, 'Please provide an age']
  },
  location: { 
    type: String, 
    required: [true, 'Please provide a location']
  },
  description: { 
    type: String
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  status: {
    type: String,
    enum: ['available', 'adopted', 'pending'],
    default: 'available'
  },
  health: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    neutered: {
      type: Boolean,
      default: false
    },
    microchipped: {
      type: Boolean,
      default: false
    }
  },
  characteristics: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model<IPet>('Pet', petSchema);