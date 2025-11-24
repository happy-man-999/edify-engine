import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, details, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <div 
        className="h-full p-6 rounded-xl backdrop-blur border transition-all duration-300 group"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px oklch(0.45 0.15 290 / 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="mb-4">
          <motion.div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 glow-effect"
            style={{
              background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
              boxShadow: '0 0 20px oklch(0.45 0.15 290 / 0.3)'
            }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold gradient-text mb-2">{title}</h3>
          <p className="text-base text-gray-300 mb-4">{description}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-4">{details}</p>
          <button 
            className="w-full flex items-center justify-center gap-2 text-gray-300 transition-colors rounded-md py-2"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(209, 213, 219)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;

