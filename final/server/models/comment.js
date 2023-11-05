import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    product: {
      type: ObjectId,
      ref: 'Product',
    },
    text: {
      type: String,
      minLength: 5,
      maxLength: 160,
    },
    rating: {
      type: Number,
      trim: true,
      required: true,
      min: 0,
      max: 5,
    },
    replies: [
      {
        user: {
          type: ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          minLength: 5,
          maxLength: 160,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
