import React from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingSpinner from "../LoadingSpinner";

const AppsSection = ({ currency, onAddToCart }) => {
  const { showPrice } = useCurrency();
  const { getApps, loading, error } = useItems();
  const apps = getApps();
  
  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <div className="text-center text-red-500 py-8">
          Error loading apps: {error}
        </div>
      </section>
    );
  }
  
  if (apps.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          No apps available at the moment.
        </div>
      </section>
    );
  }
  
  return (
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
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <div className={`bg-[#42677D] text-white text-xs px-2 py-1 rounded${currency === 'SOL' ? ' hidden' : ''}`}>
                ${item.priceUSD}
              </div>
              <div className={`bg-[#0EA47A] text-white text-xs px-2 py-1 rounded${currency === 'SOL' ? '' : ' hidden'}`}>
                {showPrice(item.priceUSD) ? `${showPrice(item.priceUSD).toFixed(4)} SOL` : '...'}
              </div>
            </div>
            <p className="text-gray-500 text-xs mb-3">{item.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-yellow-400 text-xs">
                {Array.from({length: Math.floor(item.rating)}, (_, i) => <i key={i} className="fas fa-star"></i>)}
                {item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                <span className="text-gray-500 ml-1">({item.reviewCount})</span>
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
};

export default AppsSection;
