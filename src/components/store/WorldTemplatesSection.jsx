import React, { useState } from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";
import ThreeDObjectCard from "./ThreeDObjectCard";
import ThreeDPreviewModal from "../ThreeDPreviewModal";

const WorldTemplatesSection = ({ currency, onAddToCart, onItemSelect }) => {
  const { showPrice } = useCurrency();
  const { getWorldTemplates, loading, error } = useItems();
  const [previewItem, setPreviewItem] = useState(null);
  
  const worldTemplates = getWorldTemplates();
  
  // Use world templates from the hook
  const displayTemplates = worldTemplates;
  
  const handlePreviewClick = (item) => {
    if (item.sceneAssets) {
      setPreviewItem(item);
    }
  };
  
  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">World Templates</h2>
        </div>
        <LoadingState
          title="Loading World Templates"
          message="Fetching the latest world templates..."
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
          <h2 className="text-2xl font-bold">World Templates</h2>
        </div>
        <ErrorState
          title="Failed to Load World Templates"
          message="We couldn't load the world templates. This might be a temporary issue."
          onRetry={() => window.location.reload()}
          className="my-8"
        />
      </section>
    );
  }
  
  if (displayTemplates.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">World Templates</h2>
        </div>
        <EmptyState
          title="No World Templates Available"
          message="We don't have any world templates at the moment. Check back soon for new world templates!"
          icon="fas fa-globe"
          className="my-8"
        />
      </section>
    );
  }
  
  return (
    <>
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">World Templates</h2>
          <button className="text-[#42677D] hover:text-[#355263] flex items-center">
            <span>View All</span>
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTemplates.map((item, i) => (
            <ThreeDObjectCard
              key={item._id || item.id || i}
              item={item}
              onItemSelect={onItemSelect}
              onAddToCart={onAddToCart}
              onPreview={handlePreviewClick}
              currency={currency}
            />
          ))}
        </div>
      </section>
      
      {/* 3D Preview Modal */}
      {previewItem && (
        <ThreeDPreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownload={() => onItemSelect(previewItem)}
        />
      )}
    </>
  );
};

export default WorldTemplatesSection;
