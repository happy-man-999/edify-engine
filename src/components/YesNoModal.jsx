import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeYesNoModal } from '../store/uiSlice';

const YesNoModal = () => {
  const dispatch = useDispatch();
  const { open, message, modalId } = useSelector(state => state.ui.yesNoModal);

  if (!open) return null;

  const handleYes = () => {
    // Dispatch custom event with result
    window.dispatchEvent(new CustomEvent('yesNoModalResponse', {
      detail: { modalId, result: true }
    }));
    dispatch(closeYesNoModal());
  };

  const handleNo = () => {
    // Dispatch custom event with result
    window.dispatchEvent(new CustomEvent('yesNoModalResponse', {
      detail: { modalId, result: false }
    }));
    dispatch(closeYesNoModal());
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
            <h2 className="text-xl font-bold">Confirm Action</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-6 text-center" style={{ color: 'oklch(0.98 0.01 280)' }}>{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
              }}
              onClick={handleNo}
            >
              No
            </button>
            <button
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
              }}
              onClick={handleYes}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YesNoModal;