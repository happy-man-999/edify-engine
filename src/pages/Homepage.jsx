import React from "react";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import WorldsSection from "../components/WorldsSection";
import ExploreSection from "../components/ExploreSection";
import GlobalStyles from "../components/GlobalStyles";

const Homepage = () => (
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

export default Homepage;
