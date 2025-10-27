import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnapshotSelectionModal } from '../store/uiSlice';

const SnapshotSelectionModal = () => {
  const dispatch = useDispatch();
  const { open, modalId } = useSelector(state => state.ui.snapshotSelectionModal);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState('default');
  const [defaultSnapshot, setDefaultSnapshot] = useState(null);

  useEffect(() => {
    if (open) {
      fetchSnapshots();
    }
  }, [open]);

  const fetchSnapshots = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user snapshots
      const snapshotsResponse = await fetch('/api/user/snapshots', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch default snapshot info from settings
      const settingsResponse = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (snapshotsResponse.ok) {
        const data = await snapshotsResponse.json();
        setSnapshots(data.snapshots || []);
      }

      if (settingsResponse.ok) {
        const data = await settingsResponse.json();
        setDefaultSnapshot(data.settings?.defaultSnapshotId || null);
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleSubmit = () => {
    // Dispatch custom event with result
    window.dispatchEvent(new CustomEvent('snapshotSelectionModalResponse', {
      detail: { 
        modalId, 
        result: selectedSnapshot === 'default' ? null : selectedSnapshot 
      }
    }));
    dispatch(closeSnapshotSelectionModal());
    setSelectedSnapshot('default');
  };

  const handleCancel = () => {
    // Dispatch custom event with null result (cancelled)
    window.dispatchEvent(new CustomEvent('snapshotSelectionModalResponse', {
      detail: { modalId, result: undefined }
    }));
    dispatch(closeSnapshotSelectionModal());
    setSelectedSnapshot('default');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-center">
            <i className="fas fa-database mr-3 text-xl"></i>
            <h2 className="text-xl font-bold">Choose Snapshot for New World</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Select a snapshot to use as the base for your new world. You can use the default template or one of your saved backups.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <i className="fas fa-spinner fa-spin text-3xl text-[#42677D]"></i>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Default Snapshot Option */}
              <div
                onClick={() => setSelectedSnapshot('default')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSnapshot === 'default'
                    ? 'border-[#42677D] bg-[#42677D]/5'
                    : 'border-gray-200 hover:border-[#42677D]/50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSnapshot === 'default'
                          ? 'border-[#42677D] bg-[#42677D]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedSnapshot === 'default' && (
                        <i className="fas fa-check text-white text-xs"></i>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900">Default Template</h3>
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Official Edify Engine template with the latest features and updates
                    </p>
                    {defaultSnapshot && (
                      <p className="text-xs text-gray-400 mt-1">
                        Snapshot ID: {defaultSnapshot}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* User Snapshots */}
              {snapshots.length > 0 ? (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Snapshots</h4>
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.snapshotId}
                      onClick={() => setSelectedSnapshot(snapshot.snapshotId)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSnapshot === snapshot.snapshotId
                          ? 'border-[#42677D] bg-[#42677D]/5'
                          : 'border-gray-200 hover:border-[#42677D]/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedSnapshot === snapshot.snapshotId
                                ? 'border-[#42677D] bg-[#42677D]'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedSnapshot === snapshot.snapshotId && (
                              <i className="fas fa-check text-white text-xs"></i>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{snapshot.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              snapshot.status === 'available' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {snapshot.status}
                            </span>
                          </div>
                          {snapshot.description && (
                            <p className="text-sm text-gray-600 mt-1">{snapshot.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                            <span>
                              <i className="fas fa-calendar-alt mr-1"></i>
                              {new Date(snapshot.createdAt).toLocaleDateString()}
                            </span>
                            {snapshot.sizeGigabytes && (
                              <span>
                                <i className="fas fa-hdd mr-1"></i>
                                {snapshot.sizeGigabytes} GB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg mt-4">
                  <i className="fas fa-info-circle text-gray-400 text-2xl mb-2"></i>
                  <p className="text-sm text-gray-600">
                    You don't have any saved snapshots yet.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Create backups from your worlds to use them as templates.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              onClick={handleSubmit}
              disabled={loading}
            >
              <i className="fas fa-check mr-2"></i>
              Create World
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotSelectionModal;

