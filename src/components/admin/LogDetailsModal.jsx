import React from 'react';
import { shortAddress } from '../../utils/format';

const LogDetailsModal = ({ open, log, onClose }) => {
  if (!open || !log) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderKV = (label, value) => (
    <div>
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      <p className="text-sm text-gray-900 break-all">
        {label.toLowerCase() === 'signature' ? shortAddress(String(value)) : String(value)}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Log Details</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-2xl">×</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderKV('Message', log.message)}
            {renderKV('Type', log.type)}
            {renderKV('Level', log.level)}
            {renderKV('Status', log.status || 'n/a')}
            {renderKV('Timestamp', formatDateTime(log.timestamp))}
            {renderKV('User', log.userId ? `${log.userId.firstName} ${log.userId.lastName} (${log.userId.email})` : 'N/A')}
            {log.dropletId != null && renderKV('Droplet ID', log.dropletId)}
            {log.itemId && renderKV('Item ID', log.itemId)}
            {log.transactionId && renderKV('Transaction ID', log.transactionId)}
          </div>

          {/* Details */}
          {log.details && Object.keys(log.details).length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Details</h4>
              <div className="text-sm text-gray-900">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium text-gray-600 mr-2">{key}:</span>
                    {typeof value === 'object' ? (
                      <pre className="mt-1 text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                    ) : (
                      <span>{key === 'signature' ? shortAddress(String(value)) : String(value)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Metadata</h4>
              <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto">{JSON.stringify(log.metadata, null, 2)}</pre>
            </div>
          )}

          {/* Error */}
          {log.error && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Error</h4>
              <pre className="text-xs bg-red-50 border border-red-200 text-red-800 rounded p-3 overflow-x-auto">{log.error}</pre>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetailsModal;

