import React, { useState } from 'react';
import { useUserPurchases } from '../../hooks/useUserPurchases';
import ThreeDObjectCard from './ThreeDObjectCard';
import ThreeDPreviewModal from '../ThreeDPreviewModal';

const MyPurchasesSection = ({ onItemSelect, onBrowseStore }) => {
  const {
    purchases,
    loading,
    error,
    hasMore,
    loadMore,
    downloadItem
  } = useUserPurchases();
  const [previewItem, setPreviewItem] = useState(null);

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

  const handlePreviewClick = (item) => {
    if (item.sceneAssets) {
      setPreviewItem(item);
    }
  };

  if (loading && purchases.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42677D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>Failed to load purchases</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          <i className="fas fa-shopping-bag text-4xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
          <p>Start exploring our store to find amazing items!</p>
        </div>
        <button 
          onClick={onBrowseStore}
          className="btn-primary"
        >
          Browse Store
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Purchases</h2>
        <span className="text-sm text-gray-600">
          {purchases.length} item{purchases.length !== 1 ? 's' : ''} purchased
        </span>
      </div>

      {/* Purchases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {purchases.map((purchase) => {
          const handleDownload = () => {
            downloadItem(
              purchase.transactionId, 
              purchase.item.title, 
              purchase.item.type === '3d-object' ? 'HYP' : 'File'
            );
          };

          // Use ThreeDObjectCard for all item types
          return (
            <ThreeDObjectCard
              key={purchase.id}
              item={purchase.item}
              onItemSelect={() => handleDownload()}
              onDownload={handleDownload}
              onPreview={handlePreviewClick}
              showPurchaseInfo={true}
              purchaseDate={formatDate(purchase.purchaseDate)}
              paymentMethod={purchase.paymentMethod}
              currency={purchase.currency}
            />
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* 3D Preview Modal */}
      {previewItem && (
        <ThreeDPreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownload={() => {
            const purchase = purchases.find(p => p.item._id === previewItem._id || p.item.id === previewItem.id);
            if (purchase) {
              downloadItem(
                purchase.transactionId, 
                purchase.item.title, 
                purchase.item.type === '3d-object' ? 'HYP' : 'File'
              );
            }
            setPreviewItem(null);
          }}
        />
      )}
    </div>
  );
};

export default MyPurchasesSection;
