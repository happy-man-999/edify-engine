import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const StatCounter = ({ end, duration = 2, prefix = '', suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
      style={{ overflow: 'visible', minWidth: 0 }}
    >
      <div 
        className="text-5xl md:text-6xl font-bold gradient-text mb-2 font-['Orbitron'] whitespace-nowrap"
        style={{ overflow: 'visible', display: 'inline-block' }}
      >
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
        {label}
      </div>
    </motion.div>
  );
};

export default StatCounter;

