import { useState } from 'react';

export default function OfflineMessageModal({ isOpen, userName, onSendPlaintext, onWait, onQueue, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
      <div className="card-sky shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-themed-heading">User Offline</h2>
        
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{userName}</span> is currently offline. How would you like to proceed?
        </p>

        <div className="space-y-3">
          <button
            onClick={onSendPlaintext}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-2xl text-white font-medium transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
          >
            Send Unencrypted
          </button>

          <button
            onClick={onWait}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-2xl text-white font-medium transition-all disabled:opacity-40"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Wait for Online (Don't Send)
          </button>

          <button
            onClick={onQueue}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-2xl text-white font-medium transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
          >
            Queue Message (Auto-Send Later)
          </button>
        </div>

        <p className="text-sm mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
          Encrypted sends only when user comes online
        </p>
      </div>
    </div>
  );
}
