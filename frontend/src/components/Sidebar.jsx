import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { api } from '../lib/api';
import { Search, User, Info, LogOut, MessageCircle } from 'lucide-react';
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
    <div className="w-80 bg-white border-r border-sky-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-sky-gradient text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={image3} 
              alt="SamVad" 
              className="w-8 h-8 rounded-lg logo-sky" 
            />
            <h1 className="text-xl font-bold">SamVad</h1>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onShowProfile}
              className="p-2 hover:bg-sky-primary-dark rounded-lg transition-colors"
              data-testid="button-profile"
            >
              <User size={18} />
            </button>
            <button 
              onClick={onShowAbout}
              className="p-2 hover:bg-sky-primary-dark rounded-lg transition-colors"
              data-testid="button-about"
            >
              <Info size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-sky-primary-dark rounded-lg transition-colors"
              data-testid="button-logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Current User Profile */}
      <div className="p-4 border-b border-sky-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-sky-300">
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
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sky-deep">{user?.fullname}</h3>
            <p className="text-sm text-neutral-600 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sky-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-sky pl-10"
            data-testid="input-search"
          />
          <Search className="absolute left-3 top-3 text-neutral-400" size={16} />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto mb-4 text-sky-primary" size={48} />
            <p className="text-neutral-500">No conversations yet</p>
            <p className="text-sm text-neutral-400 mt-1">Start a new chat with someone!</p>
          </div>
        ) : (
          filteredUsers.map((chatUser) => (
            <div
              key={chatUser._id}
              onClick={() => selectChat(chatUser._id)}
              className={`p-4 hover:bg-sky-50 cursor-pointer border-b border-sky-100 transition-colors ${
                activeChat === chatUser._id ? 'bg-sky-100 border-sky-300' : ''
              }`}
              data-testid={`chat-user-${chatUser._id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-sky-200 hover:border-sky-300 transition-all duration-200">
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
                  {/* Online indicator for active users */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sky-deep truncate">
                    {chatUser.fullname}
                  </h4>
                  <p className="text-sm text-neutral-600 truncate">
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