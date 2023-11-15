import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
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
    fullName: {
      type: String,
      required: [true, "Замовлення повинно мати ім'я клієнта"],
    },
    city: {
      type: String,
      required: [true, 'Замовлення повинно мати місто доставки'],
    },
    region: {
      type: String,
      required: [true, 'Замовлення повинно мати регіон доставки'],
    },
    phone: {
      type: String,
      required: [true, 'Клієнт має мати телефон'],
    },
    postNumber: {
      type: String,
      required: [true, 'Необхідний номер віділення пошти'],
    },
    paymentMethod: {
      type: String,
      default: 'Готівка',
      enum: ['Готівка', 'Передплата', 'Криптовалюта'],
    },
    cartTotal: {
      type: Number,
      required: [true, 'Необхідна сума замовлення'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
