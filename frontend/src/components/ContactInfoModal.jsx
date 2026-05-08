import { X } from 'lucide-react';

export default function ContactInfoModal({ show, onClose, user }) {
  if (!show) return null;
  const getInitials = (fullname) =>
    fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
      <div className="card-sky w-full max-w-md relative animate-sky-slide">
        <div className="p-6">
          <button className="absolute top-4 right-4 transition-colors" onClick={onClose} style={{ color: 'var(--text-tertiary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>
            <X size={24} />
          </button>
          <h2 className="text-lg font-semibold mb-4 text-themed-heading">Contact Info</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 avatar-themed rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-2">
              {user?.profilephoto ? (
                <img 
                  src={user.profilephoto} 
                  alt={user.fullname}
                  className="w-14 h-14 rounded-full object-cover" 
                />
              ) : (
                <span className="text-white">{getInitials(user?.fullname || 'User')}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-themed-heading">{user?.fullname}</div>
              <div className="text-sm text-themed-tertiary">{user?.email || 'No email'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
