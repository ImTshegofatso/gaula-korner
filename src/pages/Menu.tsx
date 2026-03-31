import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Check } from 'lucide-react';
import { motion, circOut } from 'framer-motion';

// ✅ Animation for the whole grid (staggered children)
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay between item animations
    },
  },
};

// ✅ TypeScript-safe easing using circOut from Framer Motion v11
const itemVariants = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: circOut, // ✅ FIXED FOR TS + FM v11
    },
  },
};

export default function Menu() {
  const addToCart = useStore((state) => state.addToCart);
  const products = useStore((state) => state.products);
  const [addedItems, setAddedItems] = useState<{ [key: number]: boolean }>({});

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAddedItems({ ...addedItems, [product.id]: true });

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-12 pb-16">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4 text-orange-600">
          Our Menu
        </h1>
        <p className="text-lg text-gray-600">
          Discover our mouth-watering selection of chips, wings, wraps, burgers, and refreshing smoothies.
        </p>
      </div>

      {/* CATEGORY SECTIONS */}
      <div className="space-y-16">
        {categories.map((category) => (
          <div key={category} className="space-y-6">
            
            {/* CATEGORY TITLE */}
            <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-orange-200 pb-2 flex items-center gap-2">
              <span className="bg-orange-600 w-2 h-8 rounded-full inline-block"></span>
              {category}
            </h2>

            {/* ✅ ANIMATED GRID */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products
                .filter((p) => p.category === category)
                .map((product) => (
                  
                  // ✅ FALLING ITEM
                  <motion.div key={product.id} variants={itemVariants}>
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col border border-gray-100">

                      {/* IMAGE */}
                      <div className="h-56 overflow-hidden relative group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-bold shadow-md">
                          ZAR {product.price.toFixed(2)}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {product.name}
                        </h3>

                        <p className="text-gray-600 mb-6 flex-grow">
                          {product.description}
                        </p>

                        {/* ADD TO CART BUTTON */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                            addedItems[product.id]
                              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
                              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
                          }`}
                        >
                          {addedItems[product.id] ? (
                            <>
                              <Check size={20} /> Added to Cart
                            </>
                          ) : (
                            <>
                              <Plus size={20} /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}