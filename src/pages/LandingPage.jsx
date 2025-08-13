import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import SolanaPaymentSection from '../components/landing/SolanaPaymentSection';
import ReviewsSection from '../components/landing/ReviewsSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';
import GlobalStyles from '../components/GlobalStyles';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <GlobalStyles />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <UseCasesSection />
      <SolanaPaymentSection />
      <ReviewsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage; 