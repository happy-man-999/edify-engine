import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HeroSection from "../components/HeroSection";
import QuickActions from "../components/QuickActions";
import WorldsSection from "../components/WorldsSection";
import ExploreSection from "../components/ExploreSection";
import GlobalStyles from "../components/GlobalStyles";

const Homepage = () => {
  const { isAuthenticated, checkSignupProgress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProgress = async () => {
      if (isAuthenticated) {
        try {
          const progressData = await checkSignupProgress();
          
          if (progressData && progressData.shouldRedirectToSignup) {
            // User hasn't completed signup, redirect to signup
            navigate('/signup');
          }
        } catch (error) {
          console.error('Error checking signup progress:', error);
        }
      }
    };

    checkProgress();
  }, [isAuthenticated, checkSignupProgress, navigate]);

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
