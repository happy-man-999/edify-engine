import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Layers, 
  Users, 
  Brain, 
  Globe, 
  Zap,
  Code,
  Palette,
  Server,
  Shield,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Badge from '../components/landing/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';

const FeaturesPage = () => {
  const features = [
    {
      icon: Wand2,
      title: 'Visual World Builder',
      description: 'Drag-and-drop interface for creating stunning 3D environments',
      details: [
        'Intuitive scene composition tools',
        'Real-time preview and editing',
        'Smart object snapping and alignment',
        'Multi-layer scene management'
      ]
    },
    {
      icon: Layers,
      title: 'Asset Library',
      description: 'Thousands of high-quality 3D models and textures',
      details: [
        '10,000+ pre-built 3D assets',
        'PBR materials and textures',
        'Animated character library',
        'Import custom assets (FBX, GLTF)'
      ]
    },
    {
      icon: Brain,
      title: 'Visual Scripting',
      description: 'Add interactivity without writing code',
      details: [
        'Node-based logic system',
        'Pre-built behavior templates',
        'Event triggers and actions',
        'State machine support'
      ]
    },
    {
      icon: Users,
      title: 'Multiplayer Ready',
      description: 'Real-time collaboration and social features',
      details: [
        'Built-in voice chat',
        'Avatar customization',
        'Up to 100 concurrent users',
        'Synchronized object interactions'
      ]
    },
    {
      icon: Globe,
      title: 'Cross-Platform Deploy',
      description: 'Build once, run everywhere',
      details: [
        'Web (WebGL/WebXR)',
        'iOS and Android',
        'VR headsets (Meta Quest, PSVR)',
        'Desktop (Windows, Mac, Linux)'
      ]
    },
    {
      icon: Zap,
      title: 'Instant Publishing',
      description: 'One-click deployment and hosting',
      details: [
        'Global CDN distribution',
        'Auto-scaling infrastructure',
        'Custom domain support',
        'SSL certificates included'
      ]
    },
    {
      icon: Palette,
      title: 'Advanced Graphics',
      description: 'Cutting-edge rendering technology',
      details: [
        'Real-time global illumination',
        'Dynamic shadows and reflections',
        'Post-processing effects',
        'LOD system for performance'
      ]
    },
    {
      icon: Code,
      title: 'Developer API',
      description: 'Extend with custom code when needed',
      details: [
        'JavaScript/TypeScript SDK',
        'REST API access',
        'Webhook integrations',
        'Custom component support'
      ]
    },
    {
      icon: Server,
      title: 'Backend Services',
      description: 'Managed infrastructure for your worlds',
      details: [
        'User authentication',
        'Database and storage',
        'Analytics and insights',
        'A/B testing tools'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade protection',
      details: [
        'End-to-end encryption',
        'GDPR compliant',
        'Content moderation tools',
        'User permission system'
      ]
    },
    {
      icon: Headphones,
      title: 'Spatial Audio',
      description: 'Immersive 3D sound design',
      details: [
        'Positional audio system',
        'Audio zones and triggers',
        'Background music layers',
        'Voice chat with spatial audio'
      ]
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'AI-powered creation tools',
      details: [
        'Natural language scene generation',
        'AI texture creation',
        'Smart asset recommendations',
        'Auto-optimization suggestions'
      ]
    }
  ];

  const comparisons = [
    { feature: 'Visual World Builder', edify: true, unity: false, unreal: false },
    { feature: 'No Coding Required', edify: true, unity: false, unreal: false },
    { feature: 'Built-in Hosting', edify: true, unity: false, unreal: false },
    { feature: 'One-Click Deploy', edify: true, unity: false, unreal: false },
    { feature: 'Asset Library (10k+)', edify: true, unity: 'partial', unreal: 'partial' },
    { feature: 'Multiplayer Built-in', edify: true, unity: 'addon', unreal: 'addon' },
    { feature: 'Cross-Platform', edify: true, unity: true, unreal: true },
    { feature: 'Visual Scripting', edify: true, unity: 'addon', unreal: true },
    { feature: 'Free Tier', edify: true, unity: 'limited', unreal: 'limited' },
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
                Complete Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                Everything You Need
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                A comprehensive toolkit for creating, deploying, and monetizing immersive 3D experiences
              </p>
            </motion.div>

            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                  <TabsTrigger value="all">All Features</TabsTrigger>
                  <TabsTrigger value="creation">Creation</TabsTrigger>
                  <TabsTrigger value="deployment">Deploy</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
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
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                        </div>
                        <div>
                          <ul className="space-y-2">
                            {feature.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="creation" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.filter((_, i) => i < 4).map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <div 
                        className="h-full p-6 rounded-xl backdrop-blur border"
                        style={{
                          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                        }}
                      >
                        <div className="mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{
                              background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                            }}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                        </div>
                        <div>
                          <ul className="space-y-2">
                            {feature.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.filter((_, i) => i >= 4 && i < 8).map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <div 
                        className="h-full p-6 rounded-xl backdrop-blur border"
                        style={{
                          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                        }}
                      >
                        <div className="mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{
                              background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                            }}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                        </div>
                        <div>
                          <ul className="space-y-2">
                            {feature.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.filter((_, i) => i >= 8).map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <div 
                        className="h-full p-6 rounded-xl backdrop-blur border"
                        style={{
                          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                        }}
                      >
                        <div className="mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{
                              background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                            }}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                        </div>
                        <div>
                          <ul className="space-y-2">
                            {feature.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section 
          className="px-4 py-24 relative"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.12 0.02 280), oklch(0.18 0.05 285))'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                How We Compare
              </h2>
              <p className="text-xl text-gray-300">
                See why creators choose Edify Engine over traditional game engines
              </p>
            </motion.div>

            <div 
              className="backdrop-blur border rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                borderColor: 'oklch(0.25 0.05 285 / 0.5)'
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'oklch(0.25 0.05 285 / 0.5)' }}>
                      <th className="text-left p-6 font-semibold text-white">Feature</th>
                      <th className="text-center p-6 font-semibold">
                        <span className="gradient-text">Edify Engine</span>
                      </th>
                      <th className="text-center p-6 font-semibold text-gray-300">Unity</th>
                      <th className="text-center p-6 font-semibold text-gray-300">Unreal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, index) => (
                      <tr 
                        key={row.feature} 
                        className={index !== comparisons.length - 1 ? 'border-b' : ''}
                        style={index !== comparisons.length - 1 ? { borderColor: 'oklch(0.25 0.05 285 / 0.5)' } : {}}
                      >
                        <td className="p-6 font-medium text-white">{row.feature}</td>
                        <td className="text-center p-6">
                          {row.edify === true ? (
                            <CheckCircle2 className="w-6 h-6 inline-block" style={{ color: 'oklch(0.85 0.18 130)' }} />
                          ) : row.edify === 'partial' ? (
                            <span className="text-gray-300 text-sm">Partial</span>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="text-center p-6 text-gray-300">
                          {row.unity === true ? (
                            <CheckCircle2 className="w-6 h-6 inline-block" />
                          ) : row.unity === 'addon' ? (
                            <span className="text-sm">Add-on</span>
                          ) : row.unity === 'limited' ? (
                            <span className="text-sm">Limited</span>
                          ) : row.unity === 'partial' ? (
                            <span className="text-sm">Partial</span>
                          ) : (
                            <span className="text-sm">—</span>
                          )}
                        </td>
                        <td className="text-center p-6 text-gray-300">
                          {row.unreal === true ? (
                            <CheckCircle2 className="w-6 h-6 inline-block" />
                          ) : row.unreal === 'addon' ? (
                            <span className="text-sm">Add-on</span>
                          ) : row.unreal === 'limited' ? (
                            <span className="text-sm">Limited</span>
                          ) : row.unreal === 'partial' ? (
                            <span className="text-sm">Partial</span>
                          ) : (
                            <span className="text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience all features with our free tier. No credit card required.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center text-lg px-8 py-6 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 glow-accent"
                style={{
                  background: 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.50 0.18 260))',
                  color: 'oklch(0.12 0.02 280)',
                  boxShadow: '0 0 30px oklch(0.85 0.18 130 / 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                  e.currentTarget.style.boxShadow = '0 0 40px oklch(0.85 0.18 130 / 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.50 0.18 260))';
                  e.currentTarget.style.boxShadow = '0 0 30px oklch(0.85 0.18 130 / 0.4)';
                }}
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default FeaturesPage;

