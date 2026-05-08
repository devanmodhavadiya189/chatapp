import { Camera } from 'lucide-react';
import { getInitials } from '../../utils/userHelpers';

export default function ProfilePictureSection({ user, handleFileChange }) {
  return (
    <div className="p-6 border-b border-themed">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-32 h-32 avatar-themed rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold shadow-lg border-4">
            {user?.profilephoto ? (
              <img 
                src={user.profilephoto} 
                alt={user.fullname}
                className="w-28 h-28 rounded-full object-cover" 
              />
            ) : (
              <span className="text-3xl">{getInitials(user?.fullname || 'User')}</span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-3 rounded-full cursor-pointer transition-all shadow-lg border-2" style={{ background: 'var(--accent-primary)', color: 'white', borderColor: 'var(--bg-surface-solid)' }}>
            <Camera size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="font-semibold text-themed-heading">{user?.fullname}</h3>
          <p className="text-sm text-themed-tertiary">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
