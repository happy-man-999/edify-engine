import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import SolanaPaymentSection from '../components/landing/SolanaPaymentSection';
import ReviewsSection from '../components/landing/ReviewsSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';
import Separator from '../components/landing/Separator';
import GlobalStyles from '../components/GlobalStyles';

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <GlobalStyles />
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <Separator className="my-8" />
      <UseCasesSection />
      <SolanaPaymentSection />
      <Separator className="my-8" />
      <ReviewsSection />
      <CTASection />
      <div id="resources">
        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage; 