import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import ProfileModal from '../components/ProfileModal';
import image1 from '../assets/image1.jpg';

export default function Chat() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { loadUsers } = useChat();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex bg-sky-subtle animate-sky-fade">
      {/* Sidebar */}
      <Sidebar
        onShowProfile={() => setShowProfile(true)}
        onShowAbout={() => setLocation('/about')}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}