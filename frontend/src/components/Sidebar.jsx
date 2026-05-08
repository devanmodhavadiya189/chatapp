import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Search, User, Info, LogOut, MessageCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import image3 from '../assets/image3.jpg';

export default function Sidebar({ onShowProfile, onShowAbout }) {
  const { user, logout } = useAuth();
  const { users, activeChat, selectChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u._id !== user?._id && 
    u.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (fullname) => {
    return fullname
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-full sm:w-80 bg-themed-surface-solid border-r border-themed flex flex-col h-full max-h-screen sm:max-h-full" style={{ transition: 'background 0.3s ease, border-color 0.3s ease' }}>
      {}
      <div className="p-4 sidebar-header-bg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={image3} 
              alt="SamVad" 
              className="w-8 h-8 rounded-xl logo-sky" 
            />
            <h1 className="text-xl font-bold">SamVad</h1>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowProfile && onShowProfile();
              }}
              className="p-3 min-w-[44px] min-h-[44px] hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors flex items-center justify-center"
              data-testid="button-profile"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <User size={18} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowAbout && onShowAbout();
              }}
              className="p-3 min-w-[44px] min-h-[44px] hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors flex items-center justify-center"
              data-testid="button-about"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <Info size={18} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
              }}
              className="p-3 min-w-[44px] min-h-[44px] hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors flex items-center justify-center"
              data-testid="button-logout"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <LogOut size={18} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {}
      <div className="p-4 border-b border-themed">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 avatar-themed rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2">
              {user?.profilephoto ? (
                <img 
                  src={user.profilephoto} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              ) : (
                <span className="text-sm">{getInitials(user?.fullname || 'User')}</span>
              )}
            </div>
            {}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-themed-surface-solid shadow-sm" style={{ borderColor: 'var(--bg-surface-solid)' }}></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-themed-heading">{user?.fullname}</h3>
            <p className="text-sm text-themed-secondary truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {}
      <div className="p-4 border-b border-themed">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-sky pl-10"
            data-testid="input-search"
          />
          <Search className="absolute left-3 top-3 text-themed-muted" size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

  {}
  <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto mb-4" size={48} style={{ color: 'var(--accent-primary)' }} />
            <p className="text-themed-tertiary">No conversations yet</p>
            <p className="text-sm text-themed-muted mt-1">Start a new chat with someone!</p>
          </div>
        ) : (
          filteredUsers.map((chatUser) => (
            <div
              key={chatUser._id}
              onClick={() => selectChat(chatUser._id)}
              className={`p-4 cursor-pointer border-b transition-all duration-200 ${
                activeChat === chatUser._id 
                  ? 'border-themed' 
                  : 'border-themed-light'
              }`}
              style={{
                background: activeChat === chatUser._id ? 'var(--bg-surface-active)' : 'transparent',
              }}
              onMouseEnter={(e) => { if (activeChat !== chatUser._id) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
              onMouseLeave={(e) => { if (activeChat !== chatUser._id) e.currentTarget.style.background = 'transparent'; }}
              data-testid={`chat-user-${chatUser._id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 avatar-themed rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 transition-all duration-200">
                    {chatUser.profilephoto ? (
                      <img 
                        src={chatUser.profilephoto} 
                        alt={chatUser.fullname}
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-sm">{getInitials(chatUser.fullname)}</span>
                    )}
                  </div>
                  {}
                  {chatUser.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 shadow-sm" style={{ borderColor: 'var(--bg-surface-solid)' }}></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-themed-heading truncate">
                    {chatUser.fullname}
                  </h4>
                  <p className="text-sm text-themed-secondary truncate">
                    Start a conversation
                  </p>
                </div>
                {chatUser.unseenCount > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full ml-2">
                    {chatUser.unseenCount > 99 ? '99+' : chatUser.unseenCount}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}