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
  
  // Temporary test items to ensure cart functionality works
  const testApps = [
    {
      id: 'app-1',
      title: 'Analytics Dashboard',
      description: 'Real-time data visualization for your virtual worlds',
      type: 'app',
      category: 'business',
      priceUSD: 3.99,
      image: 'https://via.placeholder.com/300x200/42677D/FFFFFF?text=Analytics',
      rating: 4.0,
      reviewCount: 42,
      isActive: true
    },
    {
      id: 'app-2',
      title: 'Multiplayer System',
      description: 'Seamless multiplayer integration for your experiences',
      type: 'app',
      category: 'gaming',
      priceUSD: 59.99,
      image: 'https://via.placeholder.com/300x200/0EA47A/FFFFFF?text=Multiplayer',
      rating: 3.5,
      reviewCount: 28,
      isActive: true
    },
    {
      id: 'app-3',
      title: 'AI Assistant',
      description: 'Complete inventory management for virtual items',
      type: 'app',
      category: 'creative',
      priceUSD: 49.99,
      image: 'https://via.placeholder.com/300x200/5E8EA9/FFFFFF?text=AI+Assistant',
      rating: 4.5,
      reviewCount: 35,
      isActive: true
    },
    {
      id: 'app-4',
      title: '3D Model Library',
      description: 'Extensive collection of 3D models and assets',
      type: 'app',
      category: 'creative',
      priceUSD: 24.99,
      image: 'https://via.placeholder.com/300x200/42677D/FFFFFF?text=3D+Models',
      rating: 4.2,
      reviewCount: 67,
      isActive: true
    }
  ];
  
  // Use test apps if no apps are loaded
  const displayApps = apps.length > 0 ? apps : testApps;
  
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
          className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
          onClick={() => onItemSelect(item)}
        >
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
