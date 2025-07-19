// src/pages/Home/Home.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Products from '../Products/Products';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Home.css';

// Import product images
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';
import img3 from '../../assets/images/img3.jpg';
import img4 from '../../assets/images/img4.jpg';
import img5 from '../../assets/images/img5.jpg';
import img6 from '../../assets/images/img6.jpg';
import img7 from '../../assets/images/img7.jpg';
import img10 from '../../assets/images/img10.jpg';
import img11 from '../../assets/images/img11.jpg';
import img12 from '../../assets/images/img12.jpg';
import img13 from '../../assets/images/img13.jpg';
import img15 from '../../assets/images/img15.jpg';
import img16 from '../../assets/images/img16.jpg';
import img17 from '../../assets/images/img17.jpg';
import img18 from '../../assets/images/img18.jpg';
import img19 from '../../assets/images/img19.jpg';
import img20 from '../../assets/images/img20.jpg';
import img21 from '../../assets/images/img21.jpeg';

const productList = [
  { id: '1', name: 'ARDUINO UNO DIP & CABLE', image: img15, price: 649.0, stock: 50, category: 'Development Boards' },
  { id: '2', name: 'IR Wireless Remote Module', image: img3, price: 88.5, stock: 100, category: 'Sensors' },
  { id: '3', name: '1k Ohm Resistor', image: img1, price: 1.18, stock: 1000, category: 'Components' },
  { id: '4', name: 'IR Sensor Module', image: img4, price: 35.4, stock: 200, category: 'Sensors' },
  { id: '5', name: 'JUMPER WIRE FF 40 PC', image: img5, price: 59.0, stock: 150, category: 'Accessories' },
  { id: '6', name: 'JUMPER WIRE MM 40 PC', image: img6, price: 59.0, stock: 150, category: 'Accessories' },
  { id: '7', name: 'LCD DISPLAY 12C', image: img7, price: 182.9, stock: 80, category: 'Displays' },
  { id: '8', name: 'Soil Moisture Sensor', image: img10, price: 41.3, stock: 120, category: 'Sensors' },
  { id: '9', name: 'ULTRASONIC SENSOR', image: img11, price: 82.6, stock: 90, category: 'Sensors' },
  { id: '10', name: 'Battery Holder', image: img12, price: 23.6, stock: 300, category: 'Power' },
  { id: '11', name: 'ESP32 Dev Board', image: img13, price: 211.82, stock: 60, category: 'Development Boards' },
  { id: '12', name: 'Li-ion Battery', image: img16, price: 88.5, stock: 40, category: 'Power' },
  { id: '13', name: 'BREADBOARD 400 PIN', image: img17, price: 41.3, stock: 200, category: 'Prototyping' },
  { id: '14', name: 'CAR CHASSIS', image: img18, price: 566.4, stock: 30, category: 'Robotics' },
  { id: '15', name: 'Digital LDR Module', image: img19, price: 35.0, stock: 150, category: 'Sensors' },
  { id: '16', name: 'Motor Driver Shield', image: img21, price: 177.0, stock: 70, category: 'Motor Control' },
  { id: '17', name: 'DIP LED GREEN 3mm', image: img20, price: 1.18, stock: 700, category: 'Components' },
  { id: '18', name: 'DIP LED RED 5mm', image: img2, price: 2.0, stock: 600, category: 'Components' },
];

const Home = () => {
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'featured',
    priceRange: [0, 1000],
    inStock: false,
  });

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    if (!user) {
      toast.error('Please login to continue');
      return navigate('/login', { state: { from: '/checkout' } });
    }
    addToCart(product);
    navigate('/checkout');
  };

  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  const handlePriceChange = (e, index) => {
    let val = Number(e.target.value);
    let newRange = [...filters.priceRange];

    if (index === 0) {
      val = Math.min(val, newRange[1]);
    } else {
      val = Math.max(val, newRange[0]);
    }

    newRange[index] = val;
    setFilters({ ...filters, priceRange: newRange });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      sortBy: 'featured',
      priceRange: [0, 1000],
      inStock: false,
    });
  };

  const categoryCounts = productList.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-6 filter-section">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter Products</h2>
            <button onClick={resetFilters} className="text-blue-600 text-sm hover:underline">
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category-select" className="text-sm font-medium block mb-1">
                Category
              </label>
              <select
                id="category-select"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full mt-1 border p-2 rounded"
              >
                <option value="">All Categories</option>
                {Object.keys(categoryCounts).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryCounts[cat]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-select" className="text-sm font-medium block mb-1">
                Sort By
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full mt-1 border p-2 rounded"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
              </p>
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium">In Stock Only</label>
            </div>
          </div>
        </section>

        <p className="text-sm mb-4 text-gray-600">
          Showing {filteredProducts.length} of {productList.length} products
        </p>

        <Products products={filteredProducts} />
      </main>
    </div>
  );
};

export default Home;
