import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingCart, Menu as MenuIcon, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { cart, user, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-orange-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-white p-2 rounded-full shadow-md">
                <span className="text-orange-600 font-bold text-xl">GK</span>
              </div>
              <span className="font-bold text-2xl text-white tracking-wide">Gaula Korner</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/menu" className="text-orange-50 hover:text-white font-medium flex items-center gap-1">
              <MenuIcon size={20} />
              <span className="hidden sm:inline">Menu</span>
            </Link>
            
            <Link to="/cart" className="relative text-orange-50 hover:text-white font-medium flex items-center gap-1">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  {cartItemCount}
                </span>
              )}
            </Link>

    {user ? (
      <div className="relative ml-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-orange-50 hover:text-white flex items-center"
        >
          <UserIcon size={24} />
        </button>

    {/* Dropdown */}
    {menuOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
        <button
          onClick={() => {
            logout();
            setMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    )}
  </div>
  ) : (
  <Link to="/login" className="text-orange-50 hover:text-white font-medium flex items-center gap-1 ml-4">
    <UserIcon size={20} />
    <span className="hidden sm:inline">Sign In</span>
  </Link>
  )}
          </div>
        </div>
      </div>
    </nav>
  );
}
