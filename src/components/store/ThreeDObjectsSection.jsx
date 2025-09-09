import React, { useState } from "react";
import { useCurrency } from "../../hooks/useCurrency";
import { useItems } from "../../hooks/useItems";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";
import ThreeDObjectCard from "./ThreeDObjectCard";
import ThreeDPreviewModal from "../ThreeDPreviewModal";

const ThreeDObjectsSection = ({ currency, onAddToCart, onItemSelect }) => {
  const { showPrice } = useCurrency();
  const { get3DObjects, loading, error } = useItems();
  const [previewItem, setPreviewItem] = useState(null);
  
  const threeDObjects = get3DObjects();
  
  // Use test objects if no 3D objects are loaded
  const displayObjects = threeDObjects;
  
  const handlePreviewClick = (item) => {
    if (item.sceneAssets) {
      setPreviewItem(item);
    }
  };
  
  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">3D Objects</h2>
        </div>
        <LoadingState
          title="Loading 3D Objects"
          message="Fetching the latest 3D objects..."
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
          <h2 className="text-2xl font-bold">3D Objects</h2>
        </div>
        <ErrorState
          title="Failed to Load 3D Objects"
          message="We couldn't load the 3D objects. This might be a temporary issue."
          onRetry={() => window.location.reload()}
          className="my-8"
        />
      </section>
    );
  }
  
  if (displayObjects.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">3D Objects</h2>
        </div>
        <EmptyState
          title="No 3D Objects Available"
          message="We don't have any 3D objects at the moment. Check back soon for new 3D assets!"
          icon="fas fa-cube"
          className="my-8"
        />
      </section>
    );
  }
  
  
  return (
    <>
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">3D Objects</h2>
          <button className="text-[#42677D] hover:text-[#355263] flex items-center">
            <span>View All</span>
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayObjects.map((item, i) => (
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

export default ThreeDObjectsSection;
