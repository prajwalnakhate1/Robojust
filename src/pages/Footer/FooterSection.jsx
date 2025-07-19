import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCheck,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Enter a valid email");
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-gradient-to-b from-indigo-950 via-blue-900 to-cyan-900 text-white px-6 py-12 mt-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        <section aria-label="About VoltX">
          <h3 className="text-2xl font-extrabold text-cyan-400 mb-5 tracking-tight animate-pulse">
            VoltX
          </h3>
          <p className="text-sm text-gray-200 mb-5 leading-relaxed font-medium">
            Empowering innovation with premium electronics and robotics components.
          </p>
          <div className="flex space-x-5">
            <a
              href="#"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            >
              <FaFacebookF className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </section>

        <nav aria-label="Shop links">
          <h4 className="text-lg font-semibold text-cyan-400 mb-5 tracking-wide">Shop</h4>
          <ul className="text-sm space-y-4">
            <li>
              <a
                href="/products"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 relative group font-medium"
              >
                All Products
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            </li>
            <li>
              <a
                href="/cart"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 relative group font-medium"
              >
                Cart
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            </li>
            <li>
              <a
                href="/checkout"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 relative group font-medium"
              >
                Login/Register
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            </li>
          </ul>
        </nav>

        <address className="not-italic" aria-label="Contact information">
          <h4 className="text-lg font-semibold text-cyan-400 mb-5 tracking-wide">Contact</h4>
          <ul className="text-sm space-y-4">
            <li className="flex items-center gap-3 text-gray-200 font-medium">
              <FaPhoneAlt className="text-cyan-400 w-5 h-5" aria-hidden="true" /> +91 9423680682
            </li>
            <li className="flex items-center gap-3 text-gray-200 font-medium">
              <FaEnvelope className="text-cyan-400 w-5 h-5" aria-hidden="true" /> voltxtechnologies@gmail.com
            </li>
            <li className="flex items-center gap-3 text-gray-200 font-medium">
              <FaClock className="text-cyan-400 w-5 h-5" aria-hidden="true" /> Mon - Sat: 9AM - 5PM
            </li>
          </ul>
        </address>

        <section aria-label="Newsletter subscription">
          <h4 className="text-lg font-semibold text-cyan-400 mb-5 tracking-wide">Stay Updated</h4>
          {subscribed ? (
            <div className="flex items-center gap-3 text-green-400 animate-fade-in" role="alert">
              <FaCheck className="w-5 h-5" aria-hidden="true" /> Subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-indigo-800/70 text-gray-100 placeholder-gray-400 border border-indigo-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-300 text-sm shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={error ? "email-error" : undefined}
                aria-invalid={!!error}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
              {error && (
                <p
                  id="email-error"
                  className="text-red-400 text-xs font-medium"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </section>
      </div>

      <div className="text-center text-sm text-gray-300 border-t border-indigo-700/30 pt-6 mt-10">
        © {currentYear} VoltX Technologies. All rights reserved.
        <nav aria-label="Legal">
          <ul className="ml-3 flex gap-3 justify-center">
            <li>
              <a
                href="/privacy"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="/cookies"
                className="text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium"
              >
                Cookies
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
