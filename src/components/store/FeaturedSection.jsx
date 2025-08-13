import React from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";

const FeaturedSection = ({ currency, onAddToCart }) => {
  const { showPrice } = useCurrency();
  const { getFeaturedItems, loading, error } = useItems();
  const featured = getFeaturedItems();
  
  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
        </div>
        <LoadingState
          title="Loading Featured Items"
          message="Fetching the latest featured items..."
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
          <h2 className="text-2xl font-bold">Featured Items</h2>
        </div>
        <ErrorState
          title="Failed to Load Featured Items"
          message="We couldn't load the featured items. This might be a temporary issue."
          onRetry={() => fetchFeaturedItems()}
          className="my-8"
        />
      </section>
    );
  }
  
  if (featured.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
        </div>
        <EmptyState
          title="No Featured Items"
          message="We don't have any featured items at the moment. Check back soon for new highlights!"
          icon="fas fa-star"
          className="my-8"
        />
      </section>
    );
  }
  
  return (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Featured Items</h2>
      <button className="text-[#42677D] hover:text-[#355263] flex items-center">
        <span>View All</span>
        <i className="fas fa-chevron-right ml-2"></i>
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((item, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative">
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
            <i className="fas fa-star mr-1"></i> Featured
          </div>
          <div className="h-48 bg-gray-100 overflow-hidden [perspective:1000px] [transform-style:preserve-3d]">
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
                <span className="text-gray-500 ml-1">({item.reviewCount})</span>
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

export default FeaturedSection;