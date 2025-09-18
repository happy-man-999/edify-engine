import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import WorldsSection from "../components/WorldsSection";
import ExploreSection from "../components/ExploreSection";
import GlobalStyles from "../components/GlobalStyles";

const Homepage = () => {
  return (
    <main className="flex-1 p-6 pt-24">
      <GlobalStyles />
      
      {/* Page-specific Schema */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://edifyengine.com/home",
        "name": "Edify Engine Home",
        "description": "Launch immersive 3D worlds and interactive environments in minutes with Edify Engine."
      })}
      </script>
      
      <div className="max-w-7xl mx-auto">
        {/*<HeroSection />*/}
        {/*<QuickActions />*/}
        <WorldsSection />
        <ExploreSection />
      </div>
    </main>
  );
};

export default Homepage;
