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
      className="rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative group"
      style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
      onClick={handleCardClick}
    >
      {/* Item Type Badge */}
      <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full z-10" style={{ backgroundColor: 'oklch(0.45 0.15 290)', color: 'oklch(0.98 0.01 280)' }}>
        <i className={`fas ${getItemIcon(item.type)} mr-1`}></i>
        {getItemTypeLabel(item.type)}
      </div>

      {/* Download Button for Purchases */}
      {showPurchaseInfo && onDownload && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleDownloadClick}
            className="p-2 rounded-full transition-colors duration-200"
            style={{ backgroundColor: 'oklch(0.50 0.18 260)', color: 'oklch(0.98 0.01 280)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.55 0.18 260)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
            }}
            title="Download"
          >
            <i className="fas fa-download text-sm"></i>
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="h-48 overflow-hidden" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
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
          <h3 className="font-semibold line-clamp-1" style={{ color: 'oklch(0.98 0.01 280)' }}>{item.title}</h3>
          <div className={`text-sm px-2 py-1 rounded${currency === 'SOL' ? ' hidden' : ''}`} style={{ backgroundColor: 'oklch(0.45 0.15 290)', color: 'oklch(0.98 0.01 280)' }}>
            ${item.priceUSD}
          </div>
          <div className={`text-sm px-2 py-1 rounded${currency === 'SOL' ? '' : ' hidden'}`} style={{ backgroundColor: 'oklch(0.50 0.18 260)', color: 'oklch(0.98 0.01 280)' }}>
            {currency === 'SOL' ? `${(item.priceUSD * 0.01).toFixed(4)} SOL` : '...'}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{item.description}</p>

        {/* Rating and File Size */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm" style={{ color: 'oklch(0.60 0.15 320)' }}>
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

        {/* Purchase Info for My Purchases */}
        {showPurchaseInfo && (
          <div className="space-y-2 text-sm mb-3 pt-3 border-t" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
            <div className="flex justify-between items-center">
              <span style={{ color: 'oklch(0.65 0.05 280)' }}>Purchased:</span>
              <span className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(purchaseDate)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span style={{ color: 'oklch(0.65 0.05 280)' }}>Payment:</span>
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
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ backgroundColor: 'oklch(0.18 0.05 285)', color: 'oklch(0.98 0.01 280)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
              >
                View Details
              </button>
              <button
                onClick={handleDownloadClick}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{
                  background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                }}
              >
                Download
              </button>
            </>
          ) : (
            // Store buttons
            <button 
              className="flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200" 
              style={{
                borderColor: 'oklch(0.45 0.15 290)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.45 0.15 290)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
              }}
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

