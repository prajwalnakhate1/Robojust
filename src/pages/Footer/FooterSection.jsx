import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaClock, FaCheck } from "react-icons/fa";

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
    <footer className="bg-slate-900 text-slate-300 px-4 py-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-11">
        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-sky-400 w-4 h-5" />
              <span className="text-slate-200 font-medium">+91 9423680682</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-sky-400 w-4 h-4" />
              <span className="text-slate-200 font-medium">robojustconnect@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaClock className="text-sky-400 w-4 h-4" />
              <span className="text-slate-200 font-medium">Mon - Sat: 9AM - 5PM</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white">Stay Updated</h4>
          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <FaCheck className="w-4 h-4" /> Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm text-sm text-white placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded text-sm font-semibold transition-all shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto mt-5 pt-1 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-2 md:space-y-0">
          <p>© {currentYear} All rights reserved</p>
          <div className="flex space-x-5">
            <a href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-slate-200 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
