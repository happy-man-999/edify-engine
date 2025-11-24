import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Wand2, Layers, Users, Brain, Globe } from 'lucide-react';
import Badge from './Badge';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
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
          <Badge 
            className="mb-4 px-4 py-2 border"
            style={{
              backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
              color: 'oklch(0.85 0.18 130)',
              borderColor: 'oklch(0.85 0.18 130 / 0.5)'
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Everything You Need to Create
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Powerful no-code tools that make 3D creation accessible to everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Wand2}
            title="Visual Builder"
            description="Intuitive drag-and-drop interface"
            details="Create complex 3D scenes with our visual editor. No modeling software or technical knowledge required."
            delay={0}
          />
          <FeatureCard
            icon={Layers}
            title="Asset Library"
            description="Thousands of ready assets"
            details="Access a vast library of 3D models, textures, and environments to jumpstart your project."
            delay={0.1}
          />
          <FeatureCard
            icon={Zap}
            title="Instant Deploy"
            description="Launch in minutes"
            details="One-click deployment to share your world. Deploy to web, mobile, and VR instantly."
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title="Multiplayer Ready"
            description="Social experiences built-in"
            details="Add real-time multiplayer with built-in networking, voice chat, and avatars."
            delay={0.3}
          />
          <FeatureCard
            icon={Brain}
            title="Visual Scripting"
            description="Logic without code"
            details="Build interactive behaviors using visual scripting. Animate, trigger, and respond to actions."
            delay={0.4}
          />
          <FeatureCard
            icon={Globe}
            title="Cross-Platform"
            description="Works everywhere"
            details="Your worlds run on desktop, mobile, and VR headsets. Build once, deploy everywhere."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
