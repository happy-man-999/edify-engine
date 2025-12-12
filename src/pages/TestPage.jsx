import React from 'react';
import { openPhantomPopup, usePhantomPopup } from '../components/PhantomModal';

const TestPage = () => {
  // Handle actions from the popup
  usePhantomPopup((action) => {
    console.log('Phantom action:', action);
    // Handle 'create' or 'import' actions here
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center gap-6">
      {/* Button 1 - Opens Native Browser Popup */}
      <button
        onClick={openPhantomPopup}
        className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
      >
        Open
      </button>

      {/* Button 2 - Placeholder */}
      <button
        className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
      >
        Button 2
      </button>
    </div>
  );
};

export default TestPage;
