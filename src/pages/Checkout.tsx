import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import api from '../services/api';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 🔐 If cart is empty AND no success message → redirect
  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  // 🔐 If user not logged in → show login-required screen
  if (!user && !success) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white p-10 rounded-3xl shadow-2xl text-center border-t-8 border-orange-500">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Sign in Required
        </h2>
        <p className="text-gray-600 mb-6 text-lg font-medium">
          You must be signed in to complete your checkout.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 🔐 Double-protect client logic
    if (!user) {
      setError("You must be signed in to make a payment.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const paymentData = {
      amount: total,
      cardNumber: formData.get('cardNumber'),
      expiry: formData.get('expiry'),
      cvv: formData.get('cvv'),
    };

    try {
      await api.post('/payment/process', paymentData);
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white p-10 rounded-3xl shadow-2xl text-center border-t-8 border-green-500">
        <CheckCircle2 size={80} className="mx-auto text-green-500 mb-6 drop-shadow-md" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-8 text-lg font-medium">
          Your delicious order is being prepared and will be ready soon.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-orange-200 pb-4">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="text-green-600" size={24} /> Payment Details
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium shadow-inner border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
              <div className="relative">
                <input
                  name="cardNumber"
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  className="pl-12 block w-full rounded-xl border-gray-300 bg-gray-50 border p-3 focus:ring-orange-500 focus:border-orange-500 shadow-sm font-medium"
                />
                <CreditCard className="absolute left-4 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                <input
                  name="expiry"
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="block w-full rounded-xl border-gray-300 bg-gray-50 border p-3 focus:ring-orange-500 focus:border-orange-500 shadow-sm font-medium text-center"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                <input
                  name="cvv"
                  type="text"
                  required
                  placeholder="123"
                  className="block w-full rounded-xl border-gray-300 bg-gray-50 border p-3 focus:ring-orange-500 focus:border-orange-500 shadow-sm font-medium text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:-translate-y-1 mt-8"
            >
              {!user ? "Sign in to Pay" : loading ? "Processing..." : `Pay ZAR ${total.toFixed(2)}`}
            </button>

            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1 mt-4 font-medium">
              <Lock size={12} /> Secure encrypted transaction
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-orange-50 p-8 rounded-3xl shadow-inner border border-orange-100 h-fit sticky top-24">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

          <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                <span className="text-gray-600 font-medium">ZAR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-orange-200 pt-6">
            <div className="flex justify-between text-2xl font-extrabold text-gray-900">
              <span>Total</span>
              <span>ZAR {total.toFixed(2)}</span>
            </div>

            {!user && (
              <p className="mt-6 text-sm text-gray-600 text-center font-medium bg-white p-4 rounded-xl border border-gray-100">
                You must <a href="/login"></a> to complete checkout.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}