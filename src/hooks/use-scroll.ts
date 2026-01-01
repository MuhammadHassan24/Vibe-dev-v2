import { useEffect, useState } from "react";

/**
 * Custom hook to manage navbar scroll behavior.
 *
 * Detects:
 *
 * - Whether navbar should show/hide based on scroll direction
 * - Whether user scrolled up
 * - Scroll position threshold
 *
 * @param {number} threshold - Scroll distance (in px) before hiding/showing
 *   starts
 * @returns {{ showNavbar: boolean; scrolledUp: boolean }}
 */
export const useScrollDirection = (threshold = 100) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [scrolledUp, setScrolledUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < threshold) {
        // Always show when near top
        setShowNavbar(true);
        setScrolledUp(false);
      } else {
        // Scroll down → hide navbar
        if (currentScrollY > lastScrollY) {
          setShowNavbar(false);
          setScrolledUp(false);
        } else {
          // Scroll up → show navbar
          setShowNavbar(true);
          setScrolledUp(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, threshold]);

  return { showNavbar, scrolledUp };
};
