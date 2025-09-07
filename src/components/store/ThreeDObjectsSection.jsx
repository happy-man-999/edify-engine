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
  
  // Temporary test 3D objects to ensure functionality works
  const test3DObjects = [
    {
      _id: '3d-1',
      id: '3d-1',
      title: 'Modern Chair',
      description: 'A sleek and modern 3D chair model perfect for interior design projects',
      type: '3d-object',
      category: 'creative',
      priceUSD: 12.99,
      image: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Modern+Chair',
      rating: 4.8,
      reviewCount: 24,
      fileSize: '2.3 MB',
      features: ['High poly count', 'PBR materials', 'Multiple LODs', 'UV mapped'],
      supportedPlatforms: ['desktop', 'mobile', 'vr'],
      sceneAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/chair.glb',
      downloadAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/chair.hyp',
      isActive: true,
      status: 'approved'
    },
    {
      _id: '3d-2',
      id: '3d-2',
      title: 'Sci-Fi Spaceship',
      description: 'Detailed spaceship model with futuristic design and glowing elements',
      type: '3d-object',
      category: 'gaming',
      priceUSD: 29.99,
      image: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Spaceship',
      rating: 4.6,
      reviewCount: 18,
      fileSize: '5.7 MB',
      features: ['Animated parts', 'Particle effects', 'Modular design', 'Game ready'],
      supportedPlatforms: ['desktop', 'vr'],
      sceneAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/spaceship.glb',
      downloadAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/spaceship.hyp',
      isActive: true,
      status: 'approved'
    },
    {
      _id: '3d-3',
      id: '3d-3',
      title: 'Medieval Castle',
      description: 'Massive castle model with detailed architecture and realistic textures',
      type: '3d-object',
      category: 'gaming',
      priceUSD: 49.99,
      image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Castle',
      rating: 4.9,
      reviewCount: 31,
      fileSize: '12.4 MB',
      features: ['Modular pieces', 'Historical accuracy', '4K textures', 'Interior included'],
      supportedPlatforms: ['desktop', 'vr'],
      sceneAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/castle.glb',
      downloadAssets: 'https://nyc3.digitaloceanspaces.com/local-store-items/3d-objects/castle.hyp',
      isActive: true,
      status: 'approved'
    }
  ];
  
  // Use test objects if no 3D objects are loaded
  const displayObjects = threeDObjects.length > 0 ? threeDObjects : test3DObjects;
  
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
