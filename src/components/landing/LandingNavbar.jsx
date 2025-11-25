import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: 'oklch(0.12 0.02 280 / 0.8)',
        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="text-2xl font-bold gradient-text font-['Orbitron'] hover:opacity-80 transition-opacity"
          >
            Edify Engine
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium transition-colors text-gray-300"
                  style={{ '--hover-color': 'oklch(0.85 0.18 130)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium transition-colors text-gray-300"
                  style={{ '--hover-color': 'oklch(0.85 0.18 130)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 glow-effect"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                boxShadow: '0 0 20px oklch(0.45 0.15 290 / 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 transition-colors"
            onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden backdrop-blur-xl border-t"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285 / 0.95)',
            borderColor: 'oklch(0.25 0.05 285 / 0.5)'
          }}
        >
          <div className="flex flex-col gap-6 p-6">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-lg font-medium transition-colors text-gray-300"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-left text-lg font-medium transition-colors text-gray-300"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 text-white rounded-md font-semibold transition-all duration-300 w-full"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default LandingNavbar;

