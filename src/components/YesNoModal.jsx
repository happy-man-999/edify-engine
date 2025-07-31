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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">Confirm Action</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={handleNo}
            >
              No
            </button>
            <button
              className="px-6 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors"
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