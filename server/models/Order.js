import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [
    {
      productId: Number,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
