import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const products = useStore((state) => state.products);
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-12 pb-12">
      <div className="relative rounded-3xl overflow-hidden bg-orange-900 h-[60vh] flex items-center justify-center text-center px-4">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        />
        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-orange-400 drop-shadow-lg">
            Gaula Korner
          </h1>
          <p className="text-xl sm:text-2xl font-medium mb-8 text-orange-50 max-w-2xl mx-auto drop-shadow-md">
            The best chips, wings, wraps, and smoothies in town. Fresh ingredients, bold flavors.
          </p>
          <Link 
            to="/menu"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Explore Menu <ArrowRight size={24} />
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border border-orange-100 group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-bold shadow-md">
                  ZAR {product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
                <Link to="/menu" className="mt-4 text-orange-600 font-bold flex items-center gap-1 hover:text-orange-500">
                  Order Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
