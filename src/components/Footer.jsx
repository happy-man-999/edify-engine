import React from "react";
import { Link } from "react-router-dom";
import { tabs as allTabs, premiumTabs } from "./navbar/tabs";
import { useAuth } from "../hooks/useAuth";

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  
  
  let tabs = allTabs;
  
  // Filter out "Sign In" and "Try" tabs if user is authenticated
  if (isAuthenticated) {
    tabs = tabs.filter(tab => tab.title !== "Sign In" && tab.title !== "Demo");
    
    // Add role-based tabs
    if (user?.isContributor) {
      tabs.push({ title: "Contribute", href: "/contribute" });
    }
    
    if (user?.role === 'admin') {
      tabs.push({ title: "Admin Dashboard", href: "/admin" });
    }
    
    // Add premium tabs for premium plan users
    if (user?.plan === 'premium') {
      tabs.push(...premiumTabs);
    }
  }

  return (
    <footer 
      className="glass border-t py-12"
      style={{
        backgroundColor: 'oklch(0.12 0.02 280)',
        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/EE_Logo_Color_Dark_128_01.gif" alt="Edify Engine Logo" className="logo-video mr-2" width={32} height={32} />
              <span className="text-xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>Edify Engine</span>
            </div>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>
              Building the future of virtual experiences, one world at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Platform</h4>
            <ul className="space-y-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
              <li><a 
                href="/home" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >Home</a></li>
              <li><a 
                href="/store" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >Store</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Company</h4>
            <ul className="space-y-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
              <li><a 
                href="/contribute" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >Contribute</a></li>
              <li><Link 
                to="/contact" 
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/edifyengine" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors"
                style={{ color: 'oklch(0.65 0.05 280)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a 
                href="https://tiktok.com/@edifyengine" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors"
                style={{ color: 'oklch(0.65 0.05 280)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
              >
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a 
                href="https://x.com/edifyengine" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors"
                style={{ color: 'oklch(0.65 0.05 280)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)', color: 'oklch(0.65 0.05 280)' }}>
          <p>&copy; 2025 Edify Engine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
