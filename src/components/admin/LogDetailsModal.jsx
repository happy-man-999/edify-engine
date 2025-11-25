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
      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>{label}</label>
      <p className="text-sm break-all" style={{ color: 'oklch(0.98 0.01 280)' }}>
        {label.toLowerCase() === 'signature' ? shortAddress(String(value)) : String(value)}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div 
        className="rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-modalFadeIn"
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
            <div className="pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>Details</h4>
              <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium mr-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{key}:</span>
                    {typeof value === 'object' ? (
                      <pre className="mt-1 text-xs rounded p-3 overflow-x-auto" style={{ backgroundColor: 'oklch(0.12 0.02 280)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.98 0.01 280)' }}>{JSON.stringify(value, null, 2)}</pre>
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
            <div className="pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>Metadata</h4>
              <pre className="text-xs rounded p-3 overflow-x-auto" style={{ backgroundColor: 'oklch(0.12 0.02 280)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.98 0.01 280)' }}>{JSON.stringify(log.metadata, null, 2)}</pre>
            </div>
          )}

          {/* Error */}
          {log.error && (
            <div className="pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>Error</h4>
              <pre className="text-xs rounded p-3 overflow-x-auto" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', borderColor: 'oklch(0.55 0.22 25 / 0.3)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.55 0.22 25)' }}>{log.error}</pre>
            </div>
          )}

          <div className="pt-6 flex justify-end" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <button 
              onClick={onClose} 
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
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetailsModal;

