import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Heart, 
  Lightbulb, 
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  Rocket,
  Shield,
  Zap
} from 'lucide-react';
import Badge from '../components/landing/Badge';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Creator-First',
      description: 'Every decision we make starts with one question: How does this empower creators?',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We push boundaries to make advanced 3D creation accessible to everyone.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe the best ideas come from our community of creators.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'We protect creator ownership and build tools you can depend on.',
    },
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      bio: 'Former Unity Technologies. Passionate about democratizing 3D creation.',
    },
    {
      name: 'Sarah Martinez',
      role: 'CTO',
      bio: 'Ex-Epic Games engineer. Built real-time multiplayer systems at scale.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Design',
      bio: 'Award-winning XR designer. Previously at Meta Reality Labs.',
    },
    {
      name: 'Priya Patel',
      role: 'Head of Community',
      bio: 'Community builder with 10+ years helping creators succeed.',
    },
  ];

  const milestones = [
    { year: '2021', event: 'Edify Engine founded' },
    { year: '2022', event: '1,000 worlds created' },
    { year: '2023', event: 'Series A funding, $15M' },
    { year: '2024', event: '50,000+ worlds, 2,500+ creators' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
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
                Our Story
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text" style={{ lineHeight: '1.1', paddingBottom: '0.1em' }}>
                Building the Future of Creation
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                We're on a mission to make 3D world creation accessible to everyone, not just developers and technical experts.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div 
                  className="aspect-video rounded-2xl flex items-center justify-center border"
                  style={{
                    background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290 / 0.2), oklch(0.50 0.18 260 / 0.2))',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                >
                  <Globe className="w-32 h-32" style={{ color: 'oklch(0.45 0.15 290 / 0.5)' }} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Traditional 3D creation tools require years of technical training. We believe that shouldn't be the case. 
                    Edify Engine was built to empower anyone with a vision to create immersive virtual experiences, regardless of their technical background.
                  </p>
                </div>
                <div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    We've helped thousands of creators bring their virtual worlds to life. 
                    From artists and educators to entrepreneurs and storytellers, our platform enables creativity without barriers.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  Our Values
                </h2>
                <p className="text-xl text-gray-300">
                  The principles that guide everything we do
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div 
                      className="h-full p-6 rounded-xl backdrop-blur border transition-all group text-center"
                      style={{
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform"
                        style={{
                          background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                        }}
                      >
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-300">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          {/*
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  Our Journey
                </h2>
                <p className="text-xl text-gray-300">
                  Milestones that shaped our platform
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div 
                        className="p-6 rounded-xl backdrop-blur border text-center"
                        style={{
                          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                        }}
                      >
                        <div className="text-4xl font-bold gradient-text mb-2">
                          {milestone.year}
                        </div>
                        <p className="text-gray-300">{milestone.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  Meet the Team
                </h2>
                <p className="text-xl text-gray-300">
                  The people building the future of 3D creation
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div 
                      className="h-full p-6 rounded-xl backdrop-blur border transition-all group text-center"
                      style={{
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                      }}
                    >
                      <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-4 mx-auto text-3xl font-bold text-white group-hover:scale-110 transition-transform"
                        style={{
                          background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <div className="text-sm mb-3" style={{ color: 'oklch(0.85 0.18 130)' }}>{member.role}</div>
                      <p className="text-sm text-gray-300">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          */}
          </div>
        </section>

        <section 
          className="px-4 py-24 relative"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.12 0.02 280), oklch(0.18 0.05 285))'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div 
                  className="h-full p-8 rounded-xl backdrop-blur border transition-all group text-center"
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform"
                    style={{
                      background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                    }}
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Join Us</h3>
                  <p className="text-gray-300 mb-6">
                    We're always looking for talented people to join our mission
                  </p>
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-colors"
                    style={{
                      background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                    }}
                  >
                    View Open Positions
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div 
                  className="h-full p-8 rounded-xl backdrop-blur border transition-all group text-center"
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform"
                    style={{
                      background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                    }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Partner With Us</h3>
                  <p className="text-gray-300 mb-6">
                    Interested in partnerships and collaborations?
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border-2 text-gray-300 transition-colors"
                    style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgb(209, 213, 219)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div 
                  className="h-full p-8 rounded-xl backdrop-blur border transition-all group text-center"
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260 / 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform"
                    style={{
                      background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                    }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Press Kit</h3>
                  <p className="text-gray-300 mb-6">
                    Download our logos, screenshots, and media assets
                  </p>
                  <button 
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border-2 text-gray-300 transition-colors"
                    style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgb(209, 213, 219)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Download Press Kit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default AboutPage;

