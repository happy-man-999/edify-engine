import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const ThreeDObjectCard = ({ 
  item, 
  onItemSelect, 
  onAddToCart, 
  onPreview, 
  onDownload,
  showPurchaseInfo = false,
  purchaseDate,
  paymentMethod,
  currency: purchaseCurrency
}) => {
  const { showPrice } = useCurrency();
  const currency = purchaseCurrency || 'USD';
  const is3DObject = item.type === '3d-object';

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (item.sceneAssets && onPreview) {
      onPreview(item);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(item);
    }
  };

  const handleCardClick = () => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemIcon = (type) => {
    const icons = {
      'app': 'fa-mobile-alt',
      'bundle': 'fa-box',
      'template': 'fa-file-alt',
      'world': 'fa-globe',
      'asset': 'fa-cube',
      'service': 'fa-cogs',
      '3d-object': 'fa-cube'
    };
    return icons[type] || 'fa-file';
  };

  const getItemTypeLabel = (type) => {
    const labels = {
      'app': 'App',
      'bundle': 'Bundle',
      'template': 'Template',
      'world': 'World',
      'asset': 'Asset',
      'service': 'Service',
      '3d-object': '3D Object'
    };
    return labels[type] || 'Item';
  };

  const getBadgeColor = (type) => {
    return type === '3d-object' ? 'bg-purple-500' : 'bg-[#42677D]';
  };

  const getSOLPrice = () => {
    if (is3DObject) {
      // Use the currency hook for 3D objects
      return showPrice(item.priceUSD) ? `${showPrice(item.priceUSD).toFixed(4)} SOL` : '...';
    } else {
      // Use hardcoded conversion for other items (maintaining existing behavior)
      return `${(item.priceUSD * 0.01).toFixed(4)} SOL`;
    }
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative group"
      style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
      onClick={handleCardClick}
    >
      {/* Item Type Badge */}
      <div className={`absolute top-3 left-3 ${getBadgeColor(item.type)} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>
        <i className={`fas ${getItemIcon(item.type)} mr-1`}></i>
        {getItemTypeLabel(item.type)}
      </div>


      {/* Image Container */}
      <div className={`h-48 overflow-hidden ${is3DObject ? '[perspective:1000px] [transform-style:preserve-3d]' : ''}`} style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {/* 3D Preview Overlay - Only for 3D objects */}
        {is3DObject && item.sceneAssets && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handlePreviewClick}
              className="opacity-0 group-hover:opacity-100 hover:bg-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center"
              style={{ backgroundColor: 'oklch(0.98 0.01 280 / 0.9)', color: 'oklch(0.12 0.02 280)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.98 0.01 280)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.98 0.01 280 / 0.9)'; }}
            >
              <i className="fas fa-cube mr-2"></i>
              3D Preview
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold line-clamp-1" style={{ color: 'oklch(0.98 0.01 280)' }}>{item.title}</h3>
          {!showPurchaseInfo && (
            <>
              <div className={`bg-[#42677D] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? ' hidden' : ''}`}>
                ${item.priceUSD}
              </div>
              <div className={`bg-[#0EA47A] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? '' : ' hidden'}`}>
                {getSOLPrice()}
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{item.description}</p>

        {/* Rating and File Size */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-yellow-400 text-sm">
            {Array.from({length: Math.floor(item.rating || 0)}, (_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {item.rating && item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
            <span className="ml-1" style={{ color: 'oklch(0.65 0.05 280)' }}>({item.reviewCount || 0})</span>
          </div>
          <div className="text-xs" style={{ color: 'oklch(0.50 0.05 280)' }}>
            <i className="fas fa-download mr-1"></i>
            {item.fileSize || 'N/A'}
          </div>
        </div>


        {/* Action Buttons */}
        {!showPurchaseInfo && (
          <div className="flex gap-2">
            <button 
              className="flex-1 text-[#42677D] hover:text-[#355263] text-sm font-medium py-2 px-3 border border-[#42677D] rounded-lg hover:bg-[#42677D] hover:text-white transition-all duration-200" 
              onClick={handleAddToCartClick}
            >
              <i className="fas fa-cart-plus mr-1"></i> Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDObjectCard;

