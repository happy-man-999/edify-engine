import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, BookOpen } from 'lucide-react';
import Badge from './Badge';

const CTASection = () => {
  return (
    <section className="py-24 px-4 relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.1)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge 
            className="mb-6 px-4 py-2 border"
            style={{
              backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
              color: 'oklch(0.85 0.18 130)',
              borderColor: 'oklch(0.85 0.18 130 / 0.5)'
            }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Start Creating Today
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Ready to Build Your World?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators building immersive 3D experiences. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signin"
              className="inline-flex items-center justify-center text-lg px-8 py-6 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 group glow-accent"
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
              <Rocket className="w-5 h-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
              Start for Free
            </Link>
            <Link
              to="/store"
              className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ borderColor: 'oklch(0.85 0.18 130 / 0.5)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
