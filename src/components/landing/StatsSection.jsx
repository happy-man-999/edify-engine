import React from 'react';
import { motion } from 'framer-motion';
import StatCounter from './StatCounter';

const StatsSection = () => {
  return (
    <section className="py-24 px-4 relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands building the future of immersive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <StatCounter end={50000} suffix="+" label="Worlds Created" />
          <StatCounter end={2500} suffix="+" label="Active Creators" />
          <StatCounter end={98} suffix="%" label="Satisfaction Rate" />
          <StatCounter end={150000} suffix="+" label="Monthly Visitors" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
