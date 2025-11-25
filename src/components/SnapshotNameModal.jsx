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
      <div 
        className="rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn"
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
            <i className="fas fa-save mr-3 text-xl"></i>
            <h2 className="text-xl font-bold">Create Backup Snapshot</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
            Please enter a unique name for your backup snapshot. This name will help you identify the backup later.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
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
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'oklch(0.12 0.02 280)',
                borderColor: error ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.98 0.01 280)',
                '--tw-ring-color': error ? 'oklch(0.55 0.22 25)' : 'oklch(0.45 0.15 290)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = error ? 'oklch(0.55 0.22 25)' : 'oklch(0.45 0.15 290)';
                e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'oklch(0.55 0.22 25 / 0.2)' : 'oklch(0.45 0.15 290 / 0.2)'}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              disabled={isChecking}
            />
            {error && (
              <p className="mt-2 text-sm flex items-center" style={{ color: 'oklch(0.55 0.22 25)' }}>
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </p>
            )}
          </div>

          <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
            <p className="text-xs" style={{ color: 'oklch(0.45 0.15 290)' }}>
              <i className="fas fa-info-circle mr-2"></i>
              Name can only contain letters, numbers, hyphens (-), and underscores (_)
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isChecking}
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

