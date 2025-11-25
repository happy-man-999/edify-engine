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
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
          <div className="flex items-center justify-center">
            <i className="fas fa-database mr-3 text-xl"></i>
            <h2 className="text-xl font-bold">Choose Snapshot for New World</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
            Select a snapshot to use as the base for your new world. You can use the default template or one of your saved backups.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <i className="fas fa-spinner fa-spin text-3xl" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Default Snapshot Option */}
              <div
                onClick={() => setSelectedSnapshot('default')}
                className="p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: selectedSnapshot === 'default'
                    ? 'oklch(0.45 0.15 290)'
                    : 'oklch(0.25 0.05 285)',
                  backgroundColor: selectedSnapshot === 'default'
                    ? 'oklch(0.45 0.15 290 / 0.1)'
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedSnapshot !== 'default') {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290 / 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSnapshot !== 'default') {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: selectedSnapshot === 'default'
                          ? 'oklch(0.45 0.15 290)'
                          : 'oklch(0.25 0.05 285)',
                        backgroundColor: selectedSnapshot === 'default'
                          ? 'oklch(0.45 0.15 290)'
                          : 'transparent'
                      }}
                    >
                      {selectedSnapshot === 'default' && (
                        <i className="fas fa-check text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Default Template</h3>
                      <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }}>
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      Official Edify Engine template with the latest features and updates
                    </p>
                    {defaultSnapshot && (
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.50 0.05 280)' }}>
                        Snapshot ID: {defaultSnapshot}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* User Snapshots */}
              {snapshots.length > 0 ? (
                <>
                  <div className="my-4" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Your Snapshots</h4>
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.snapshotId}
                      onClick={() => setSelectedSnapshot(snapshot.snapshotId)}
                      className="p-4 border-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        borderColor: selectedSnapshot === snapshot.snapshotId
                          ? 'oklch(0.45 0.15 290)'
                          : 'oklch(0.25 0.05 285)',
                        backgroundColor: selectedSnapshot === snapshot.snapshotId
                          ? 'oklch(0.45 0.15 290 / 0.1)'
                          : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSnapshot !== snapshot.snapshotId) {
                          e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290 / 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSnapshot !== snapshot.snapshotId) {
                          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: selectedSnapshot === snapshot.snapshotId
                                ? 'oklch(0.45 0.15 290)'
                                : 'oklch(0.25 0.05 285)',
                              backgroundColor: selectedSnapshot === snapshot.snapshotId
                                ? 'oklch(0.45 0.15 290)'
                                : 'transparent'
                            }}
                          >
                            {selectedSnapshot === snapshot.snapshotId && (
                              <i className="fas fa-check text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{snapshot.name}</h3>
                            <span 
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: snapshot.status === 'available' 
                                  ? 'oklch(0.45 0.15 290 / 0.2)' 
                                  : 'oklch(0.50 0.05 280 / 0.2)',
                                color: snapshot.status === 'available' 
                                  ? 'oklch(0.45 0.15 290)' 
                                  : 'oklch(0.50 0.05 280)'
                              }}
                            >
                              {snapshot.status}
                            </span>
                          </div>
                          {snapshot.description && (
                            <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>{snapshot.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-xs space-x-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
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
                <div className="text-center py-6 rounded-lg mt-4" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                  <i className="fas fa-info-circle text-2xl mb-2" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
                  <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    You don't have any saved snapshots yet.
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'oklch(0.50 0.05 280)' }}>
                    Create backups from your worlds to use them as templates.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <button
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                }
              }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              style={{
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                }
              }}
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

