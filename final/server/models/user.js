import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    comments: [{ type: ObjectId, ref: 'Comment' }],
    passwordResetTooken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
