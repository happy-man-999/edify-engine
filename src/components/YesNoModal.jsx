import React from 'react';

const YesNoModal = ({ open, message, onYes, onNo }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="mb-4">{message}</div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onNo}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onYes}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoModal;