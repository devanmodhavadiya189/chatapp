import { X } from 'lucide-react';

export default function ContactInfoModal({ show, onClose, user }) {
  if (!show) return null;
  const getInitials = (fullname) =>
    fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="card-sky w-full max-w-md relative animate-sky-slide">
        <div className="p-6">
          <button className="absolute top-4 right-4 text-neutral-500 hover:text-sky-primary" onClick={onClose}>
            <X size={24} />
          </button>
          <h2 className="text-lg font-semibold mb-4 text-sky-deep">Contact Info</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-sky-primary rounded-full flex items-center justify-center mx-auto mb-4 text-sky-900 text-2xl font-bold">
              {user?.profilephoto ? (
                <img 
                  src={user.profilephoto} 
                  alt={user.fullname}
                  className="w-14 h-14 rounded-full object-cover" 
                />
              ) : (
                getInitials(user?.fullname || 'User')
              )}
            </div>
            <div>
              <div className="font-semibold text-sky-deep">{user?.fullname}</div>
              <div className="text-neutral-500 text-sm">{user?.email || 'No email'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
