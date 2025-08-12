import React from "react";

const apps = [
  {
    img: "https://nfp.land/wp-content/uploads/2025/04/edify-engine-analytics-Dashbaord.png",
    title: "Analytics Dashboard",
    desc: "Real-time data visualization for your virtual worlds",
    usd: "$3.99",
    btc: "0.00065 BTC",
    rating: 4,
    reviews: 42
  },
  {
    img: "https://nfp.land/wp-content/uploads/2025/04/edify-engine-multiplayer-system.png",
    title: "Multiplayer System",
    desc: "Seamless multiplayer integration for your experiences",
    usd: "$59.99",
    btc: "0.00097 BTC",
    rating: 3.5,
    reviews: 28
  },
  {
    img: "https://nfp.land/wp-content/uploads/2025/04/Edify-Engine-AI-Assistant.png",
    title: "AI Assistant",
    desc: "Complete inventory management for virtual items",
    usd: "$49.99",
    btc: "0.00081 BTC",
    rating: 4.5,
    reviews: 35
  },
  {
    img: "https://nfp.land/wp-content/uploads/2025/04/Edify-Engine-Physics-Engine.png",
    title: "Physics Engine",
    desc: "Real-time illustrating dynamic physics simulations",
    usd: "$29.99",
    btc: "0.00049 BTC",
    rating: 4,
    reviews: 52
  }
];

const AppsSection = ({ currency, onAddToCart }) => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Apps</h2>
      <button className="text-[#42677D] hover:text-[#355263] flex items-center">
        <span>View All</span>
        <i className="fas fa-chevron-right ml-2"></i>
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {apps.map((item, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
          <div className="h-40 bg-gray-100 flex items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <div className={`bg-[#42677D] text-white text-xs px-2 py-1 rounded${currency === 'BTC' ? ' hidden' : ''}`}>{item.usd}</div>
              <div className={`bg-[#f7931a] text-white text-xs px-2 py-1 rounded${currency === 'BTC' ? '' : ' hidden'}`}>{item.btc}</div>
            </div>
            <p className="text-gray-500 text-xs mb-3">{item.desc}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-yellow-400 text-xs">
                {Array.from({length: Math.floor(item.rating)}, (_, i) => <i key={i} className="fas fa-star"></i>)}
                {item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                <span className="text-gray-500 ml-1">({item.reviews})</span>
              </div>
              <button className="text-[#42677D] hover:text-[#355263] text-xs font-medium" onClick={() => onAddToCart(item)}>
                <i className="fas fa-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AppsSection;
