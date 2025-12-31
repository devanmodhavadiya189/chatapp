import { Menu, Phone, Video, MoreVertical } from 'lucide-react';
import { getInitials } from '../../utils/userHelpers';

export default function ChatHeader({ 
  activeUser, 
  showMenu, 
  setShowMenu, 
  setShowContactInfo, 
  setShowMedia, 
  onOpenSidebar 
}) {
  return (
    <div className="bg-white border-b border-sky-200 p-4 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {onOpenSidebar && (
            <button
              className="md:hidden bg-white rounded-full p-2 shadow-md border border-sky-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
              style={{ touchAction: 'manipulation' }}
            >
              <Menu className="text-sky-primary" size={20} />
            </button>
          )}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-sky-200">
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
            <h3 className="font-semibold text-sky-deep" data-testid="text-active-user-name">
              {activeUser?.fullname}
            </h3>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
            data-testid="button-voice-call"
          >
            <Phone className="text-sky-primary" size={18} />
          </button>
          <button 
            className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
            data-testid="button-video-call"
          >
            <Video className="text-sky-primary" size={18} />
          </button>
          <div className="relative">
            <button
              className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
              data-testid="button-more-options"
              onClick={() => setShowMenu((v) => !v)}
            >
              <MoreVertical className="text-sky-primary" size={18} />
            </button>
            {showMenu && (
              <div className="card-sky absolute right-0 mt-2 w-48 p-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-sky-50 rounded text-sky-deep"
                  onClick={() => { setShowContactInfo(true); setShowMenu(false); }}
                >
                  View Contact Info
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-sky-50 rounded text-sky-deep"
                  onClick={() => { setShowMedia(true); setShowMenu(false); }}
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
