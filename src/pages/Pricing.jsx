import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Zap, Rocket, Crown } from 'lucide-react';
import Badge from '../components/landing/Badge';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import GlobalStyles from '../components/GlobalStyles';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      description: 'Perfect for learning and prototyping',
      features: [
        '1 published world',
        '100 monthly visitors',
        'Basic asset library access',
        'Community support',
        'Web deployment only',
        'Edify Engine branding',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Creator',
      icon: Zap,
      price: '$29',
      description: 'For serious creators and small teams',
      features: [
        '10 published worlds',
        '10,000 monthly visitors',
        'Full asset library access',
        'Priority support',
        'All platform deployment',
        'Custom domain',
        'Remove branding',
        'Basic analytics',
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
    },
    {
      name: 'Professional',
      icon: Rocket,
      price: '$99',
      description: 'For growing businesses and studios',
      features: [
        'Unlimited published worlds',
        '100,000 monthly visitors',
        'Full asset library + premium',
        'Priority support + Slack',
        'All platform deployment',
        'Custom domain + SSL',
        'Remove branding',
        'Advanced analytics',
        'Team collaboration (5 seats)',
        'API access',
      ],
      cta: 'Start 14-Day Trial',
      popular: false,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Professional',
        'Unlimited monthly visitors',
        'Dedicated account manager',
        '24/7 phone support',
        'SLA guarantees',
        'Custom integrations',
        'On-premise deployment option',
        'Training and onboarding',
        'Unlimited team seats',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade at any time?',
      answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing period.',
    },
    {
      question: 'What happens if I exceed my visitor limit?',
      answer: 'We\'ll notify you when you reach 80% of your limit. If you exceed it, your worlds will continue to work, and you\'ll be charged a small overage fee or prompted to upgrade.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day free trial for paid plans. If you\'re not satisfied within the first 30 days of a paid subscription, contact us for a full refund.',
    },
    {
      question: 'Can I pay annually?',
      answer: 'Yes! Annual plans receive a 20% discount. Contact sales for annual pricing on Professional and Enterprise plans.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and for Enterprise plans, we can arrange invoicing and wire transfers.',
    },
    {
      question: 'Is there a student or educational discount?',
      answer: 'Yes! We offer 50% off Creator and Professional plans for students and educators. Contact us with proof of enrollment or employment.',
    },
  ];

  const handlePlanClick = (plan) => {
    if (plan.name === 'Enterprise' || plan.cta === 'Contact Sales') {
      navigate('/contact');
    } else if (plan.name === 'Free') {
      navigate('/signup');
    } else {
      navigate('/signup', { state: { selectedPlan: plan.name.toLowerCase() } });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <GlobalStyles />
      <LandingNavbar />
      <div className="relative pt-24 pb-16">
        <section className="px-4 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge 
                className="mb-6 px-4 py-2 text-sm border"
                style={{
                  backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
                  color: 'oklch(0.85 0.18 130)',
                  borderColor: 'oklch(0.85 0.18 130 / 0.5)'
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                Choose Your Plan
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Start free and scale as you grow. All plans include core features with no hidden fees.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={plan.popular ? 'lg:scale-105' : ''}
                >
                  <div 
                    className="h-full p-6 rounded-xl backdrop-blur border relative"
                    style={{
                      backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                      borderColor: plan.popular ? 'oklch(0.85 0.18 130)' : 'oklch(0.25 0.05 285 / 0.5)',
                      boxShadow: plan.popular ? '0 10px 15px -3px oklch(0.85 0.18 130 / 0.2)' : 'none'
                    }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          className="px-4 py-1"
                          style={{
                            backgroundColor: 'oklch(0.85 0.18 130)',
                            color: 'oklch(0.12 0.02 280)'
                          }}
                        >
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <div className="mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                        }}
                      >
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                        {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanClick(plan)}
                        className="w-full py-3 rounded-md font-semibold transition-all glow-accent"
                        style={plan.popular ? {
                          background: 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))',
                          color: 'oklch(0.12 0.02 280)',
                          boxShadow: '0 0 30px oklch(0.85 0.18 130 / 0.4)'
                        } : {
                          background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => {
                          if (plan.popular) {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130 / 0.9), oklch(0.85 0.18 130 / 0.7))';
                          } else {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (plan.popular) {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))';
                          } else {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                          }
                        }}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div 
                      className="p-6 rounded-xl backdrop-blur border"
                      style={{
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                      }}
                    >
                      <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section 
          className="px-4 py-24 relative"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.12 0.02 280), oklch(0.18 0.05 285))'
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start with our free tier and upgrade when you're ready. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center text-lg px-8 py-6 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 glow-accent"
                  style={{
                    background: 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))',
                    color: 'oklch(0.12 0.02 280)',
                    boxShadow: '0 0 30px oklch(0.85 0.18 130 / 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130 / 0.9), oklch(0.85 0.18 130 / 0.7))';
                    e.currentTarget.style.boxShadow = '0 0 40px oklch(0.85 0.18 130 / 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))';
                    e.currentTarget.style.boxShadow = '0 0 30px oklch(0.85 0.18 130 / 0.4)';
                  }}
                >
                  Start Free
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{ borderColor: 'oklch(0.85 0.18 130 / 0.5)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default Pricing;
