import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // ⬅️ Optional: for custom CSS styling

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-message">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="notfound-button">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
