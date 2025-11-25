import React from "react";

const worlds = [
  {
    url: "https://nfp.land/td/",
    img: "https://newfrontierpresents.io/wp-content/uploads/2023/12/Screenshot-2023-12-28-at-9.30.18%E2%80%AFAM.png",
    title: "Fake Business",
    desc: "Tim Dillion Show Podcast"
  },
  {
    url: "https://nfp.land/rolls-royce/",
    img: "https://newfrontierpresents.io/wp-content/uploads/2023/12/Screenshot-2023-12-28-at-9.34.08%E2%80%AFAM.png",
    title: "For Sale",
    desc: "Black Badge Rolls Royce Cullinan"
  },
  {
    url: "https://nfp.land/race",
    img: "https://newfrontierpresents.io/wp-content/uploads/2023/11/New-Frontier-Presents-Race-Club-Web3-Gaming.png",
    title: "Race Club",
    desc: "Porsche Multiplayer Racing"
  },
  {
    url: "https://nfp.land/apa/",
    img: "https://newfrontierpresents.io/wp-content/uploads/2024/03/apa04_nfp.jpg",
    title: "Trolley Problem",
    desc: "American Philosophical Association"
  },
  {
    url: "https://nfp.land/gym/",
    img: "https://nfp.land/wp-content/uploads/2023/09/GYM_D_R_26.jpg",
    title: "Gym",
    desc: "Fitness and Workout Environment"
  },
  {
    url: "https://nfp.land/lunchables/",
    img: "https://nfp.land/wp-content/uploads/2023/05/New-Frontier-Presents-Lunchables-Land.jpg",
    title: "Lunchables Land",
    desc: "Kraft Heniz MVP"
  }
];

const ExploreSection = ({ showHeader = true }) => (
  <section className="mb-12">
    {showHeader && (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>Explore</h2>
        <button className="text-[#5E8EA9] hover:text-[#42677D] flex items-center transition-colors duration-300">
          <span>View All</span>
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {worlds.map((w, i) => (
        <div key={i} onClick={() => window.open(w.url, '_blank')} className="world-card professional-card overflow-hidden cursor-pointer">
          <div className="h-48 overflow-hidden">
            <img src={w.img} alt={w.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-1" style={{ color: 'oklch(0.98 0.01 280)' }}>{w.title}</h3>
            <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{w.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ExploreSection;
