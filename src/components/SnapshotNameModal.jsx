import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnapshotNameModal } from '../store/uiSlice';

const SnapshotNameModal = () => {
  const dispatch = useDispatch();
  const { open, modalId, defaultName } = useSelector(state => state.ui.snapshotNameModal);
  const [snapshotName, setSnapshotName] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (open && defaultName) {
      setSnapshotName(defaultName);
    }
  }, [open, defaultName]);

  if (!open) return null;

  const handleSubmit = async () => {
    // Validate snapshot name
    if (!snapshotName.trim()) {
      setError('Snapshot name is required');
      return;
    }

    // Check for valid characters (alphanumeric, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!validNameRegex.test(snapshotName)) {
      setError('Snapshot name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    if (snapshotName.length < 3) {
      setError('Snapshot name must be at least 3 characters long');
      return;
    }

    if (snapshotName.length > 50) {
      setError('Snapshot name must be less than 50 characters');
      return;
    }

    // Check if snapshot name already exists
    setIsChecking(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/snapshots/check-name?name=${encodeURIComponent(snapshotName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          setError('A snapshot with this name already exists. Please choose a different name.');
          setIsChecking(false);
          return;
        }

        // Dispatch custom event with result
        window.dispatchEvent(new CustomEvent('snapshotNameModalResponse', {
          detail: { modalId, result: snapshotName }
        }));
        dispatch(closeSnapshotNameModal());
        setSnapshotName('');
        setError('');
      } else {
        setError(data.message || 'Failed to check snapshot name');
      }
    } catch (error) {
      console.error('Error checking snapshot name:', error);
      setError('Failed to check snapshot name. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCancel = () => {
    // Dispatch custom event with null result
    window.dispatchEvent(new CustomEvent('snapshotNameModalResponse', {
      detail: { modalId, result: null }
    }));
    dispatch(closeSnapshotNameModal());
    setSnapshotName('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isChecking) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-center">
            <i className="fas fa-save mr-3 text-xl"></i>
            <h2 className="text-xl font-bold">Create Backup Snapshot</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Please enter a unique name for your backup snapshot. This name will help you identify the backup later.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Snapshot Name
            </label>
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => {
                setSnapshotName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., my-world-backup-2024"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#42677D]'
              }`}
              disabled={isChecking}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Name can only contain letters, numbers, hyphens (-), and underscores (_)
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancel}
              disabled={isChecking}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              onClick={handleSubmit}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Checking...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Create Backup
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapshotNameModal;

