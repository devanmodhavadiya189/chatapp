import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function PasswordChangeForm({ formData, handleInputChange }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-label)' }}>
          Current Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="input-sky pl-10 pr-10"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-label)' }}>
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="input-sky pl-10 pr-10"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-label)' }}>
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="input-sky pl-10 pr-10"
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
