import { useState } from 'react';

export default function OfflineMessageModal({ isOpen, userName, onSendPlaintext, onWait, onQueue, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">User Offline</h2>
        
        <p className="text-gray-700 mb-6">
          <span className="font-semibold">{userName}</span> is currently offline. How would you like to proceed?
        </p>

        <div className="space-y-3">
          <button
            onClick={onSendPlaintext}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 transition"
          >
            Send Unencrypted
          </button>

          <button
            onClick={onWait}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            Wait for Online (Don't Send)
          </button>

          <button
            onClick={onQueue}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition"
          >
            Queue Message (Auto-Send Later)
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Encrypted sends only when user comes online
        </p>
      </div>
    </div>
  );
}
