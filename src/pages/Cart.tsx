import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-lg mx-auto p-12 flex flex-col items-center gap-6">
          <div className="bg-orange-100 p-6 rounded-full text-orange-600">
            <Trash2 size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
          <p className="text-lg text-gray-600">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-orange-500 transition-colors"
          >
            Go to Menu <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-orange-200 pb-4">Shopping Cart</h1>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {cart.map((item) => (
            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-orange-50/50 transition-colors">
              <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="mt-1 text-orange-600 font-bold text-lg">ZAR {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200 shadow-sm">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 rounded-xl bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="font-bold text-lg w-8 text-center text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 rounded-xl bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors ml-auto sm:ml-0"
                aria-label="Remove item"
              >
                <Trash2 size={24} />
              </button>
            </li>
          ))}
        </ul>
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gray-500 text-lg font-medium mb-1">Total Amount</p>
            <p className="text-4xl font-extrabold text-gray-900">ZAR {total.toFixed(2)}</p>
          </div>
          <Link
            to="/checkout"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-green-600/20 transition-transform transform hover:-translate-y-1"
          >
            Checkout Securely <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
