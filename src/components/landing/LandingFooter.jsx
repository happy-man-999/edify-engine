import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Youtube } from 'lucide-react';
import Separator from './Separator';

const LandingFooter = () => {
  const navigation = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Documentation', href: '/resources' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/resources' },
      { name: 'Careers', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/resources' },
      { name: 'Community', href: '/resources' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer 
      className="relative py-16 px-4 border-t"
      style={{
        backgroundColor: 'oklch(0.12 0.02 280)',
        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold gradient-text font-['Orbitron'] mb-4">
              Edify Engine
            </h3>
            <p className="text-gray-300 mb-6 max-w-sm">
              Empowering creators to build immersive 3D experiences without code. 
              Join thousands building the future of virtual worlds.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/edifyengine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border flex items-center justify-center text-gray-300 transition-colors"
                style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
                  e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(209, 213, 219)';
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/edifyengine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border flex items-center justify-center text-gray-300 transition-colors"
                style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
                  e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(209, 213, 219)';
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/edifyengine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border flex items-center justify-center text-gray-300 transition-colors"
                style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
                  e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(209, 213, 219)';
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@edifyengine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border flex items-center justify-center text-gray-300 transition-colors"
                style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'oklch(0.85 0.18 130)';
                  e.currentTarget.style.borderColor = 'oklch(0.85 0.18 130 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgb(209, 213, 219)';
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="text-gray-300 transition-colors text-sm"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-gray-300 transition-colors text-sm"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 transition-colors text-sm"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-300 transition-colors text-sm"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Edify Engine. Building the future of immersive experiences.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link 
              to="/privacy-policy"
              className="transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
            >Privacy Policy</Link>
            <Link 
              to="/terms-of-service"
              className="transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
            >Terms of Service</Link>
            <button 
              className="transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
            >Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
