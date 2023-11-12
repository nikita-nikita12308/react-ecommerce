import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [{ type: ObjectId, ref: 'Product' }],
    payment: {},
    buyer: { type: ObjectId, ref: 'User' },
    status: {
      type: String,
      default: 'Not processed',
      enum: [
        'Not processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
    },
    fullName: String,
    city: String,
    region: String,
    phone: String,
    postNumber: Number,
    paymentMethod: {
      type: String,
      default: 'Готівка',
      enum: ['Готівка', 'Передплата', 'Криптовалюта'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
