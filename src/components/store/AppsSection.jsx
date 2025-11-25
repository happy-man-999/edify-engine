import React from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";

const AppsSection = ({ currency, onAddToCart, onItemSelect }) => {
  const { showPrice } = useCurrency();
  const { getApps, loading, error } = useItems();
  const apps = getApps();
  
  // Use test apps if no apps are loaded
  const displayApps = apps;
  
  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <LoadingState
          title="Loading Apps"
          message="Fetching the latest apps from our store..."
          skeletonCount={4}
          className="my-8"
        />
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <ErrorState
          title="Failed to Load Apps"
          message="We couldn't load the apps from our store. This might be a temporary issue."
          onRetry={() => fetchItems()}
          className="my-8"
        />
      </section>
    );
  }
  
  if (displayApps.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Apps</h2>
        </div>
        <EmptyState
          title="No Apps Available"
          message="We don't have any apps in our store at the moment. Check back soon for new releases!"
          icon="fas fa-mobile-alt"
          className="my-8"
        />
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
      {displayApps.map((item, i) => (
        <div 
          key={item.id || i} 
          className="rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
          style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
          onClick={() => onItemSelect(item)}
        >
          <div className="h-40 flex items-center justify-center [perspective:1000px] [transform-style:preserve-3d]" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
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
            <p className="text-xs mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{item.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-yellow-400 text-xs">
                {Array.from({length: Math.floor(item.rating)}, (_, i) => <i key={i} className="fas fa-star"></i>)}
                {item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                <span className="ml-1" style={{ color: 'oklch(0.65 0.05 280)' }}>({item.reviewCount})</span>
              </div>
              <button 
                className="text-[#42677D] hover:text-[#355263] text-xs font-medium flex items-center" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
              >
                <i className="fas fa-cart-plus mr-1"></i>
                <span>Add to Cart</span>
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
