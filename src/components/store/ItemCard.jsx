import React from 'react';

const ItemCard = ({ 
  item, 
  onItemSelect, 
  onAddToCart, 
  onDownload,
  showPurchaseInfo = false,
  purchaseDate,
  paymentMethod,
  currency: purchaseCurrency
}) => {
  const currency = purchaseCurrency || 'USD';

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

  const formatPrice = (amount, currency) => {
    return currency === 'SOL' ? `${amount} SOL` : `$${amount}`;
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative group"
      onClick={handleCardClick}
    >
      {/* Item Type Badge */}
      <div className="absolute top-3 left-3 bg-[#42677D] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
        <i className={`fas ${getItemIcon(item.type)} mr-1`}></i>
        {getItemTypeLabel(item.type)}
      </div>

      {/* Download Button for Purchases */}
      {showPurchaseInfo && onDownload && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleDownloadClick}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-200"
            title="Download"
          >
            <i className="fas fa-download text-sm"></i>
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
          <div className={`bg-[#42677D] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? ' hidden' : ''}`}>
            ${item.priceUSD}
          </div>
          <div className={`bg-[#0EA47A] text-white text-sm px-2 py-1 rounded${currency === 'SOL' ? '' : ' hidden'}`}>
            {currency === 'SOL' ? `${(item.priceUSD * 0.01).toFixed(4)} SOL` : '...'}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>

        {/* Rating and File Size */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-yellow-400 text-sm">
            {Array.from({length: Math.floor(item.rating || 0)}, (_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {item.rating && item.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
            <span className="text-gray-500 ml-1">({item.reviewCount || 0})</span>
          </div>
          <div className="text-xs text-gray-400">
            <i className="fas fa-download mr-1"></i>
            {item.fileSize || 'N/A'}
          </div>
        </div>

        {/* Purchase Info for My Purchases */}
        {showPurchaseInfo && (
          <div className="space-y-2 text-sm mb-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Purchased:</span>
              <span className="font-medium">{formatDate(purchaseDate)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment:</span>
              <span className="font-medium">
                {paymentMethod === 'solana' ? 'Solana' : 'Stripe'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {showPurchaseInfo ? (
            // My Purchases buttons
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onItemSelect) onItemSelect(item);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                View Details
              </button>
              <button
                onClick={handleDownloadClick}
                className="flex-1 bg-[#42677D] hover:bg-[#355263] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Download
              </button>
            </>
          ) : (
            // Store buttons
            <button 
              className="flex-1 text-[#42677D] hover:text-[#355263] text-sm font-medium py-2 px-3 border border-[#42677D] rounded-lg hover:bg-[#42677D] hover:text-white transition-all duration-200" 
              onClick={handleAddToCartClick}
            >
              <i className="fas fa-cart-plus mr-1"></i> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
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

export default ItemCard;

