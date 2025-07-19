import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the top of the page whenever the route (pathname) changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scroll effect
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
