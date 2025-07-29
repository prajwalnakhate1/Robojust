import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './SearchResults.css';

// Product images imports (same as before)
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
  { name: "1k Ohm 0.25W Metal Film Resistor", image: img1, price: "1.18" },
  { name: "DIP LED RED 8mm", image: img2, price: "1.18" },
  { name: "Infrared IR Wireless Remote Control Module Kit for Arduino", image: img3, price: "88.50" },
  { name: "IR Sensor Module", image: img4, price: "35.40" },
  { name: "JUMPER WIRE FF 40 PC", image: img5, price: "59.00" },
  { name: "JUMPER WIRE MM 40 PC", image: img6, price: "59.00" },
  { name: "LCD DISPLAY 12C", image: img7, price: "182.90" },
  { name: "SmartElex Soil Moisture Sensor", image: img10, price: "41.30" },
  { name: "ULTRASONIC SENSOR", image: img11, price: "82.60" },
  { name: "18650 Battery Holder", image: img12, price: "23.60" },
  { name: "esp32", image: img13, price: "211.82" },
  { name: "ARDUINO UNO DIP & CABLE", image: img15, price: "649.00" },
  { name: "Li-ion Battery 2500mAh", image: img16, price: "88.50" },
  { name: "BREADBOARD 400 PIN", image: img17, price: "41.30" },
  { name: "CAR CHASSIS", image: img18, price: "566.40" },
  { name: "Soil Moisture Sensor", image: img19, price: "116.82" },
  { name: "DIP LED GREEN 5mm", image: img20, price: "1.18" },
  { name: "MOTOR DRIVER SHIELD", image: img21, price: "177.00" },
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();

  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  const isInCart = (name) => cartItems.some(item => item.name === name);

  const handleAddToCart = (product) => {
    if (!user) {
      alert("⚠️ Please login to add items to your cart.");
      return navigate('/login');
    }
    if (isInCart(product.name)) {
      alert("ℹ️ Item is already in your cart.");
    } else {
      addToCart(product);
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      alert("⚠️ Please login to buy items.");
      return navigate('/login');
    }
    if (!isInCart(product.name)) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <div className="products-page">
      <h1 className="text-2xl font-bold text-center mb-6">
        Search Results for: <span className="text-blue-700">"{query}"</span>
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found for "{query}".</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.name} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <div className="product-buttons">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                  disabled={isInCart(product.name)}
                >
                  {isInCart(product.name) ? "In Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="buy-now-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
