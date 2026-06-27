import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils, Calendar, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark/95 backdrop-blur-md border-b border-accent/20 py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <Utensils className="h-8 w-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-widest text-white font-serif uppercase">
                Aroma <span className="text-accent">Spices</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-accent/80 -mt-1">
                Gardens
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleNavClick}
                className="relative py-2 text-sm font-medium tracking-wider uppercase text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {link.name}
              </Link>
            ))}

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              onClick={handleNavClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-dark animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link
              to="/reserve"
              onClick={handleNavClick}
              className="flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white border border-accent/40 hover:border-accent rounded-md text-sm font-medium uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-accent/10 hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-accent" />
              <span>Book Table</span>
            </Link>
          </div>

          {/* Mobile menu and cart button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link
              to="/cart"
              onClick={handleNavClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-md transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 bg-dark/95 backdrop-blur-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
        <div className="px-4 pt-5 pb-6 space-y-3 border-t border-accent/10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleNavClick}
              className="block px-4 py-3 rounded-md text-base font-medium tracking-wider uppercase text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-accent/10 px-4">
            <Link
              to="/reserve"
              onClick={handleNavClick}
              className="flex items-center justify-center space-x-2 w-full px-5 py-3 bg-primary hover:bg-primary/95 text-white border border-accent/40 rounded-md text-base font-medium uppercase tracking-wider transition-colors shadow-md"
            >
              <Calendar className="h-5 w-5 text-accent" />
              <span>Book A Table</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
