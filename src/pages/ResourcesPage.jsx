import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  Code, 
  MessageCircle, 
  FileText,
  Sparkles,
  ArrowRight,
  Search,
  Lightbulb,
  Users,
  GraduationCap,
  Newspaper
} from 'lucide-react';
import Badge from '../components/landing/Badge';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const ResourcesPage = () => {
  const resources = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Complete guides and API references',
      items: [
        { name: 'Getting Started Guide', time: '10 min read' },
        { name: 'Visual Builder Tutorial', time: '15 min read' },
        { name: 'API Reference', time: 'Reference' },
        { name: 'Best Practices', time: '20 min read' },
      ],
      cta: 'View Docs',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video courses',
      items: [
        { name: 'Your First World', time: '12 min' },
        { name: 'Advanced Visual Scripting', time: '28 min' },
        { name: 'Multiplayer Setup', time: '18 min' },
        { name: 'Monetization Strategies', time: '15 min' },
      ],
      cta: 'Watch Videos',
    },
    {
      icon: Code,
      title: 'Code Examples',
      description: 'Sample projects and templates',
      items: [
        { name: 'Virtual Gallery Template', time: 'Download' },
        { name: 'Social Hub Starter', time: 'Download' },
        { name: 'Game World Boilerplate', time: 'Download' },
        { name: 'Event Space Template', time: 'Download' },
      ],
      cta: 'Browse Templates',
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with other creators',
      items: [
        { name: '15.2k Members', time: 'Active' },
        { name: '2.8k Discussions', time: 'This month' },
        { name: 'Expert answers', time: '< 2hr response' },
        { name: 'Weekly events', time: 'Upcoming' },
      ],
      cta: 'Join Community',
    },
  ];

  const guides = [
    {
      title: 'Building Your First Virtual World',
      description: 'A complete walkthrough from concept to deployment',
      category: 'Beginner',
      readTime: '15 min',
      icon: GraduationCap,
    },
    {
      title: 'Optimizing for VR Performance',
      description: 'Best practices for smooth VR experiences',
      category: 'Advanced',
      readTime: '12 min',
      icon: Lightbulb,
    },
    {
      title: 'Monetization Guide for Creators',
      description: 'Strategies to earn from your worlds',
      category: 'Business',
      readTime: '10 min',
      icon: Sparkles,
    },
    {
      title: 'Community Building Strategies',
      description: 'Growing an engaged user base',
      category: 'Marketing',
      readTime: '18 min',
      icon: Users,
    },
    {
      title: 'Asset Creation Guidelines',
      description: 'Creating and importing custom 3D assets',
      category: 'Technical',
      readTime: '25 min',
      icon: FileText,
    },
    {
      title: 'Multiplayer Best Practices',
      description: 'Designing great social experiences',
      category: 'Advanced',
      readTime: '20 min',
      icon: MessageCircle,
    },
  ];

  const updates = [
    {
      date: '2024-01-15',
      title: 'v2.5 Release - AI Assistant & Enhanced Physics',
      description: 'New AI-powered creation tools and improved physics simulation.',
    },
    {
      date: '2024-01-08',
      title: 'Expanded Asset Library',
      description: '5,000 new assets added including architectural elements and natural environments.',
    },
    {
      date: '2023-12-20',
      title: 'Quest 3 Support Now Live',
      description: 'Deploy to Meta Quest 3 with enhanced graphics and performance.',
    },
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
                <BookOpen className="w-4 h-4 mr-2" />
                Learning Resources
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                Learn & Grow
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                Everything you need to master 3D world creation
              </p>
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search documentation, tutorials, and guides..." 
                  className="w-full pl-12 pr-4 py-3 h-12 rounded-md text-white placeholder-gray-400 focus:outline-none"
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                    borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
                  }}
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div 
                    className="h-full p-6 rounded-xl backdrop-blur border transition-all group"
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
                    <div className="mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{
                          background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                        }}
                      >
                        <resource.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                    </div>
                    <div>
                      <ul className="space-y-3 mb-6">
                        {resource.items.map((item) => (
                          <li key={item.name} className="flex justify-between items-center text-sm">
                            <span className="text-gray-200">{item.name}</span>
                            <span className="text-gray-400 text-xs">{item.time}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-gray-300 transition-colors"
                        style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'rgb(209, 213, 219)';
                          e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.1)';
                        }}
                      >
                        {resource.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              className="mb-24"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                  Popular Guides
                </h2>
                <p className="text-xl text-gray-300">
                  In-depth articles to level up your skills
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <motion.div
                    key={guide.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <div 
                      className="h-full p-6 rounded-xl backdrop-blur border transition-all cursor-pointer group"
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
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <span 
                            className="px-2 py-1 text-xs font-semibold rounded-md"
                            style={{
                              backgroundColor: 'oklch(0.50 0.18 260 / 0.2)',
                              color: 'oklch(0.50 0.18 260)'
                            }}
                          >{guide.category}</span>
                          <span className="text-sm text-gray-400">{guide.readTime}</span>
                        </div>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                          style={{
                            background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                          }}
                        >
                          <guide.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 
                          className="text-lg font-bold text-white mb-2 transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        >
                          {guide.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{guide.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                  Latest Updates
                </h2>
                <p className="text-xl text-gray-300">
                  Stay informed about new features and improvements
                </p>
              </div>
              <div className="max-w-4xl mx-auto space-y-4">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div 
                      className="p-6 rounded-xl backdrop-blur border transition-all cursor-pointer group"
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
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                            }}
                          >
                            <Newspaper className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">{update.date}</div>
                          <h3 
                            className="text-lg font-semibold text-white mb-2 transition-colors"
                            onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                          >
                            {update.title}
                          </h3>
                          <p className="text-gray-300">{update.description}</p>
                        </div>
                        <ArrowRight 
                          className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                          onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                        />
                      </div>
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
                Need Help?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our support team is here to help you succeed
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
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
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Contact Support
                </Link>
                <button 
                  className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{ borderColor: 'oklch(0.85 0.18 130 / 0.5)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Users className="mr-2 w-5 h-5" />
                  Join Community
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default ResourcesPage;

