import React from "react";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import WorldsSection from "../components/WorldsSection";
import ExploreSection from "../components/ExploreSection";

const Homepage = () => (
  <main className="flex-1 p-6">
    <div className="max-w-7xl mx-auto">
      <HeroSection />
      <QuickActions />
      <WorldsSection />
      <ExploreSection />
    </div>
  </main>
);

export default Homepage;
