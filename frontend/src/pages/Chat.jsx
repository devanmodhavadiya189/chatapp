import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import ProfileModal from '../components/ProfileModal';

export default function Chat() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { loadUsers, activeChat, selectChat } = useChat();
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (activeChat) {
        event.preventDefault();
        selectChat(null);
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    if (activeChat) {
      window.history.pushState({ chatSelected: true }, null, window.location.pathname);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeChat, selectChat]);

  return (
    <div className="h-screen flex bg-sky-subtle animate-sky-fade overflow-hidden">
    
      <div className="hidden md:block h-full">
        <Sidebar
          onShowProfile={() => setShowProfile(true)}
          onShowAbout={() => setLocation('/about')}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-xl">
            <Sidebar
              onShowProfile={() => { setShowProfile(true); setSidebarOpen(false); }}
              onShowAbout={() => { setLocation('/about'); setSidebarOpen(false); }}
            />
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full relative">
        <ChatArea 
          onOpenSidebar={() => setSidebarOpen(true)}
          onShowProfile={() => setShowProfile(true)}
          onShowAbout={() => setLocation('/about')}
          onBackToUserList={activeChat ? () => selectChat(null) : null}
        />
      </div>
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}