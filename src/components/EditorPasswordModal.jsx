import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeEditorModal } from '../store/uiSlice';

const EditorPasswordModal = () => {
  const dispatch = useDispatch();
  const { isOpen, domain } = useSelector(state => state.ui.editorModal);
  const [copied, setCopied] = useState(false);
  const password = "ih4uciI1qwITUxGt";

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleNavigate = () => {
    const editorUrl = `https://${domain}/editor`;
    window.open(editorUrl, '_blank');
    dispatch(closeEditorModal());
  };

  const handleClose = () => {
    dispatch(closeEditorModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">Editor Access</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mb-4 text-blue-500 text-4xl">
              <i className="fas fa-code"></i>
            </div>
            <p className="text-gray-700 mb-4">
              Your personal password
            </p>
            
            {/* Password Display */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-gray-800 select-all">
                  {password}
                </code>
                <button
                  onClick={handleCopyPassword}
                  className={`ml-3 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <i className="fas fa-check mr-1"></i>
                      Copied!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy mr-1"></i>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Keep it secure and don't share it with others.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors"
              onClick={handleNavigate}
            >
              Open Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPasswordModal;
