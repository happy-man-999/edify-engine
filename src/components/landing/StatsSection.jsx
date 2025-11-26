import React from 'react';
import { motion } from 'framer-motion';
import StatCounter from './StatCounter';

const StatsSection = () => {
  return (
    <section className="py-24 px-4 relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)', overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto" style={{ overflow: 'visible' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text" style={{ lineHeight: '1.1', paddingBottom: '0.1em' }}>
            Trusted by Creators Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands building the future of immersive experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12" style={{ overflow: 'visible' }}>
          <div className="min-w-0 overflow-visible">
            <StatCounter end={50000} suffix="+" label="Worlds Created" />
          </div>
          <div className="min-w-0 overflow-visible">
            <StatCounter end={2500} suffix="+" label="Active Creators" />
          </div>
          <div className="min-w-0 overflow-visible">
            <StatCounter end={98} suffix="%" label="Satisfaction Rate" />
          </div>
          <div className="min-w-0 overflow-visible">
            <StatCounter end={150000} suffix="+" label="Monthly Visitors" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
