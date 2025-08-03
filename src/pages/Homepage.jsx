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
    <main className="flex-1 p-6">
      <GlobalStyles />
      <div className="max-w-7xl mx-auto">
        <HeroSection />
        <QuickActions />
        <WorldsSection />
        <ExploreSection />
      </div>
    </main>
  );
};

export default Homepage;
