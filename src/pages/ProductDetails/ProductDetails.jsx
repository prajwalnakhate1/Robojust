import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          toast.error('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    const alreadyInCart = cartItems.find((item) => item.id === id);
    if (alreadyInCart) {
      toast.info('Already in cart');
      return;
    }

    addToCart({ ...product, id, quantity });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to proceed');
      return;
    }

    navigate('/checkout', {
      state: {
        fromBuyNow: true,
        product: { ...product, id, quantity },
      },
    });
  };

  const toggleWishlist = () => {
    if (!user) {
      toast.error('Login to use wishlist');
      return;
    }

    const isWished = wishlistItems.some((item) => item.id === id);
    if (isWished) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ ...product, id });
      toast.success('Added to wishlist');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <img
            src={product.images?.[selectedImage]}
            alt={product.name}
            className="w-full h-96 object-contain bg-white rounded shadow"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`w-16 h-16 object-cover border rounded cursor-pointer ${
                  i === selectedImage ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex gap-4 items-center">
            <span className="text-2xl font-bold text-blue-600">
              ₹{(product.discountPrice || product.price).toFixed(2)}
            </span>
            {product.discountPrice && (
              <>
                <span className="line-through text-gray-500">₹{product.price.toFixed(2)}</span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                className="px-3 py-1 bg-gray-200"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-1 bg-gray-200"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Buy Now
            </button>
            <button
              onClick={toggleWishlist}
              className={`border px-6 py-2 rounded transition ${
                wishlistItems.some((item) => item.id === id)
                  ? 'border-red-500 text-red-500'
                  : 'border-gray-400 text-gray-700'
              }`}
            >
              {wishlistItems.some((item) => item.id === id)
                ? 'Remove from Wishlist'
                : 'Add to Wishlist'}
            </button>
          </div>

          {/* Stock Info */}
          <p className="text-sm text-gray-500 mt-2">{product.stock} in stock</p>

          {/* Details */}
          {product.details && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Product Details</h3>
              <table className="table-auto text-sm w-full">
                <tbody>
                  {Object.entries(product.details).map(([key, value]) => (
                    <tr key={key}>
                      <td className="font-medium pr-4 py-1 text-gray-600">{key}</td>
                      <td className="py-1 text-gray-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
