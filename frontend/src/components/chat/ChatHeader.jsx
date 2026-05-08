import { Menu, Phone, Video, MoreVertical } from 'lucide-react';
import { getInitials } from '../../utils/userHelpers';
import EncryptionStatus from '../crypto/EncryptionStatus';

export default function ChatHeader({ 
  activeUser, 
  showMenu, 
  setShowMenu, 
  setShowContactInfo, 
  setShowMedia, 
  onOpenSidebar,
  sharedKeyStatus
}) {
  return (
    <div className="bg-themed-surface-solid border-b border-themed p-4 flex-shrink-0 sticky top-0 z-20" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', transition: 'all 0.3s ease' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {onOpenSidebar && (
            <button
              className="md:hidden rounded-2xl p-2 shadow-md border min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
              style={{ touchAction: 'manipulation', background: 'var(--bg-surface)', borderColor: 'var(--border-main)', color: 'var(--accent-primary)' }}
            >
              <Menu size={20} />
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 avatar-themed rounded-full flex items-center justify-center text-white font-bold shadow-md border-2">
              {activeUser?.profilephoto ? (
                <img 
                  src={activeUser.profilephoto} 
                  alt={activeUser.fullname}
                  className="w-8 h-8 rounded-full object-cover" 
                />
              ) : (
                <span className="text-xs">{getInitials(activeUser?.fullname || 'User')}</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-themed-heading" data-testid="text-active-user-name">
              {activeUser?.fullname}
            </h3>
            <div style={{ marginTop: '4px' }}>
              <EncryptionStatus status={sharedKeyStatus} />
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-xl transition-colors"
            data-testid="button-voice-call"
            style={{ color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Phone size={18} />
          </button>
          <button 
            className="p-2 rounded-xl transition-colors"
            data-testid="button-video-call"
            style={{ color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Video size={18} />
          </button>
          <div className="relative">
            <button
              className="p-2 rounded-xl transition-colors"
              data-testid="button-more-options"
              onClick={() => setShowMenu((v) => !v)}
              style={{ color: 'var(--accent-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="card-sky absolute right-0 mt-2 w-48 p-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 rounded-xl text-themed-heading transition-colors"
                  onClick={() => { setShowContactInfo(true); setShowMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  View Contact Info
                </button>
                <button
                  className="w-full text-left px-4 py-2 rounded-xl text-themed-heading transition-colors"
                  onClick={() => { setShowMedia(true); setShowMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  View Media
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
