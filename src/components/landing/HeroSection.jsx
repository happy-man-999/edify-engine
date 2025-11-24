import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Play, Box, Sparkles, ChevronDown } from 'lucide-react';
import Badge from './Badge';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 pt-24" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ 
            backgroundColor: 'oklch(0.45 0.15 290 / 0.2)',
            top: '10%', 
            left: '5%' 
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ 
            backgroundColor: 'oklch(0.50 0.18 260 / 0.2)',
            bottom: '10%', 
            right: '5%' 
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-72 h-72 rounded-full blur-3xl"
          style={{ 
            backgroundColor: 'oklch(0.85 0.18 130 / 0.1)',
            top: '40%', 
            right: '20%' 
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-5xl"
      >
        <Badge 
          className="mb-6 px-4 py-2 text-sm border"
          style={{
            backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
            color: 'oklch(0.85 0.18 130)',
            borderColor: 'oklch(0.85 0.18 130 / 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.2)';
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          No-Code 3D World Creation
        </Badge>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="gradient-text">
            Build Immersive
          </span>
          <br />
          <span className="text-white">Virtual Worlds</span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Create stunning 3D experiences and interactive virtual worlds without writing code. 
          Deploy instantly with built-in monetization and true ownership.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/signin"
            className="inline-flex items-center justify-center text-lg px-8 py-6 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
            style={{ 
              background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
              boxShadow: '0 0 20px oklch(0.45 0.15 290 / 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
            }}
          >
            <Rocket className="w-5 h-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
            Start Building Now
          </Link>
          
          <a
            href="https://demo.edifyengine.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 group"
            style={{ 
              borderColor: 'oklch(0.85 0.18 130 / 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Play className="w-5 h-5 mr-2" />
            Launch Demo World
          </a>
          
          <Link
            to="/store"
            className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 group"
            style={{ 
              borderColor: 'oklch(0.45 0.15 290 / 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Box className="w-5 h-5 mr-2" />
            Browse Store
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
