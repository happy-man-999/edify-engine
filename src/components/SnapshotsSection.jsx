import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserSnapshots } from "../hooks/useUserSnapshots";
import SnapshotCard from "./SnapshotCard";

const SnapshotsSection = () => {
  const { user } = useAuth();
  const { snapshots, loading, error, refreshUserSnapshots } = useUserSnapshots();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Snapshots</h2>
          {!loading && !error && (
            <p className="text-sm text-gray-600 mt-1">
              {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshUserSnapshots}
            disabled={loading}
            className="text-[#5E8EA9] hover:text-[#42677D] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            title="Refresh snapshots"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="professional-card animate-pulse h-48">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load your snapshots: {error}</p>
          <button
            onClick={refreshUserSnapshots}
            className="bg-[#42677D] text-white px-4 py-2 rounded-md hover:bg-[#5E8EA9] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Snapshots grid */}
      {!loading && !error && snapshots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snapshots.map((snapshot) => (
            <SnapshotCard 
              key={snapshot.id} 
              snapshot={snapshot} 
              onRefresh={refreshUserSnapshots}
            />
          ))}
        </div>
      )}
      
      {/* Empty state when no snapshots exist */}
      {!loading && !error && snapshots.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-database text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No snapshots yet</h3>
          <p className="text-gray-600 mb-6">
            Create snapshots from your worlds to save backups and create templates
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Use the <strong>Backup</strong> button on your world cards to create snapshots
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SnapshotsSection;

