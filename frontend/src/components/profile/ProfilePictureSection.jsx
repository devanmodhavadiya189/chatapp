import { Camera } from 'lucide-react';
import { getInitials } from '../../utils/userHelpers';

export default function ProfilePictureSection({ user, handleFileChange }) {
  return (
    <div className="p-6 border-b border-sky-200">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold shadow-lg border-4 border-sky-300">
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
          <label className="absolute bottom-0 right-0 bg-sky-primary text-white p-3 rounded-full cursor-pointer hover:bg-sky-primary-dark transition-colors shadow-lg border-2 border-white">
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
          <h3 className="font-semibold text-sky-deep">{user?.fullname}</h3>
          <p className="text-sm text-neutral-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
