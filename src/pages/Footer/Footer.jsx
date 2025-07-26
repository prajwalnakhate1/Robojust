import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaClock, FaCheck } from "react-icons/fa";
import "./Footer.css";

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
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Info */}
        <div className="contact-section">
          <h4 className="section-title">Contact Us</h4>
          <ul className="contact-list">
            <li className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <span>+91 9423680682</span>
            </li>
            <li className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>robujustconnect@gmail.com</span>
            </li>
            <li className="contact-item">
              <FaClock className="contact-icon" />
              <span>Mon - Sat: 9AM - 5PM</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <h4 className="section-title">Stay Updated</h4>
          {subscribed ? (
            <div className="subscribed-message">
              <FaCheck className="success-icon" /> 
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
              </div>
              <button type="submit" className="subscribe-btn">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="bottom-content">
          <p className="copyright">© {currentYear} All rights reserved</p>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/cookies" className="footer-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;