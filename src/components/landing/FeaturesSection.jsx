import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      icon: "fas fa-cube",
      title: "3D Asset Library",
      description: "Access thousands of high-quality 3D models, textures, and animations"
    },
    {
      icon: "fas fa-code",
      title: "No-Code Builder",
      description: "Create complex virtual worlds without writing a single line of code"
    },
    {
      icon: "fas fa-users",
      title: "Multiplayer Ready",
      description: "Built-in networking for real-time collaborative experiences"
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Cross-Platform",
      description: "Deploy to VR, AR, web, and mobile devices seamlessly"
    },
    {
      icon: "fas fa-rocket",
      title: "Instant Deployment",
      description: "Go from concept to live experience in minutes, not months"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access controls"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Person Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1920&h=1080&fit=crop" 
          alt="Man wearing VR glasses experiencing 3D virtual world" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/70"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Everything You Need to Build
            <span className="block bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent leading-tight">
              Amazing Virtual Worlds
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools, assets, and infrastructure 
            you need to create stunning 3D experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl border border-gray-200 hover:border-[#42677D] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#42677D] to-[#5E8EA9] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className={`${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 