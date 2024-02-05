import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    payment: {},
    buyer: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Не оброблено",
      enum: [
        "Не оброблено",
        "Обробка",
        "Відправлено",
        "Доставлено",
        "Скасовано",
      ],
    },
    fullName: {
      type: String,
      required: [true, "Замовлення повинно мати ім'я клієнта"],
    },
    city: {
      type: String,
      required: [true, "Замовлення повинно мати місто доставки"],
    },
    region: {
      type: String,
      required: [true, "Замовлення повинно мати регіон доставки"],
    },
    phone: {
      type: String,
      required: [true, "Клієнт має мати телефон"],
    },
    postNumber: {
      type: String,
      required: [true, "Необхідний номер віділення пошти"],
    },
    paymentMethod: {
      type: String,
      default: "Готівка",
      enum: ["Готівка", "Передплата", "Криптовалюта"],
    },
    paymentStatus: {
      type: String,
      default: "Не оплачено",
      enum: ["Не оплачено", "Оплачено"],
    },
    cartTotal: {
      type: Number,
      required: [true, "Необхідна сума замовлення"],
    },
    orderNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const highestOrder = await this.constructor
        .findOne({}, "orderNumber")
        .sort({ orderNumber: -1 })
        .exec();
      this.orderNumber = highestOrder ? highestOrder.orderNumber + 1 : 1;
      await this.validate();
    } catch (err) {
      console.error("Error generating order number", error);
      throw err;
    }
  }
  next();
});

export default mongoose.model("Order", orderSchema);
