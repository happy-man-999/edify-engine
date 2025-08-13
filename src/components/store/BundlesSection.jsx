import React, { useEffect, useState } from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";

const BundlesSection = ({ currency, onAddToCart }) => {
  const { showPrice } = useCurrency();
  const { getBundles, loading, error } = useItems();
  const bundles = getBundles();
  
  // Countdown timer for the special bundle offer
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00" });
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Premium Bundles</h2>
        </div>
        <LoadingState
          title="Loading Bundles"
          message="Fetching the latest premium bundles..."
          skeletonCount={3}
          className="my-8"
        />
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Premium Bundles</h2>
        </div>
        <ErrorState
          title="Failed to Load Bundles"
          message="We couldn't load the premium bundles. This might be a temporary issue."
          onRetry={() => fetchItems()}
          className="my-8"
        />
      </section>
    );
  }
  
  if (bundles.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Premium Bundles</h2>
        </div>
        <EmptyState
          title="No Bundles Available"
          message="We don't have any premium bundles in our store at the moment. Check back soon for new offers!"
          icon="fas fa-boxes"
          className="my-8"
        />
      </section>
    );
  }
  
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Premium Bundles</h2>
        <button className="text-[#42677D] hover:text-[#355263] flex items-center">
          <span>View All</span>
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
      {/* Special Bundle Offer */}
      <div className="bg-gradient-to-br from-[#42677D] to-[#5E8EA9] text-white mb-8 relative overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(66,103,125,0.2)] cursor-pointer animate-[pulse_2s_infinite]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#42677D] to-[#5E8EA9] opacity-90"></div>
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0 md:w-2/3">
              <div className="absolute top-4 right-4 bg-[#f7931a] text-white font-bold px-3 py-1 rounded-full text-sm rotate-[5deg] shadow-lg">
                <i className="fas fa-bolt mr-1"></i> LIMITED TIME
              </div>
              <h3 className="text-3xl font-bold mb-3">Starter Creator Bundle</h3>
              <p className="text-white text-opacity-90 mb-4">Everything you need to launch your virtual world at an unbeatable price</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <i className="fas fa-globe text-sm"></i>
                  </div>
                  <span>1 World Template</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <i className="fas fa-cube text-sm"></i>
                  </div>
                  <span>5 Premium 3D Objects</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <i className="fas fa-mobile-alt text-sm"></i>
                  </div>
                  <span>20 Essential Apps</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <i className="fas fa-server text-sm"></i>
                  </div>
                  <span>Dedicated Server</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2 inline-flex items-center mb-6">
                <i className="fas fa-clock mr-2"></i>
                <span>Offer ends in:</span>
                <span className="font-bold text-lg mx-1">{countdown.hours}</span>
                <span>h</span>
                <span className="font-bold text-lg mx-1">{countdown.minutes}</span>
                <span>m</span>
                <span className="font-bold text-lg mx-1">{countdown.seconds}</span>
                <span>s</span>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white text-opacity-80">Total Value:</span>
                  <span className="line-through text-xl">$1,247+</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white text-opacity-80">Bundle Price:</span>
                  <span className="text-3xl font-bold">$267</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white text-opacity-80">You Save:</span>
                  <span className="text-green-300 font-bold">78%</span>
                </div>
                <button className="w-full bg-[#f7931a] hover:bg-[#e6830a] text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center" onClick={() => onAddToCart({title: 'Starter Creator Bundle'})}>
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
                <div className="mt-3 text-center text-sm text-white text-opacity-80">
                  <i className="fas fa-lock mr-1"></i> Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Other Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((item, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative">
            <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <i className="fas fa-boxes mr-1"></i> Bundle
            </div>
            <div className="h-48 bg-gray-100 flex items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <div className={`bg-[#42677D] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? ' hidden' : ''}`}>
                  ${item.priceUSD}
                </div>
                <div className={`bg-[#0EA47A] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? '' : ' hidden'}`}>
                  {showPrice(item.priceUSD) ? `${showPrice(item.priceUSD).toFixed(4)} SOL` : '...'}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-400 text-sm">
                  {Array.from({length: Math.floor(item.rating)}, (_, i) => <i key={i} className="fas fa-star"></i>)}
                  {item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                  <span className="text-gray-500 ml-1">{item.reviewCount ? `(${item.reviewCount})` : null}</span>
                </div>
                <button className="text-[#42677D] hover:text-[#355263] text-sm font-medium" onClick={() => onAddToCart(item)}>
                  <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BundlesSection;
